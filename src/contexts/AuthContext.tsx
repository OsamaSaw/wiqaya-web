import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';

type UserRole = 'client' | 'guard' | 'admin';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async (): Promise<string | null> => {
    if (currentUser) {
      try {
        return await currentUser.getIdToken();
      } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
      }
    }
    return null;
  };

  const fetchUserData = async (user: User) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const userData = response.data as UserData;
      
      // Check if user has admin role
      if (!userData.role || !['client', 'guard', 'admin'].includes(userData.role)) {
        throw new Error('Invalid user role. Please contact support.');
      }
      
      // For admin panel, only allow admin users
      if (userData.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      setUserData(userData);
      
      // Store token for API calls
      localStorage.setItem('firebaseToken', token);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear auth state if user data fetch fails
      await signOut(auth);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(userCredential.user);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear any stored tokens on login failure
      localStorage.removeItem('firebaseToken');
      setUserData(null);
      
      // Re-throw the error with a user-friendly message
      if (error.message.includes('Access denied') || error.message.includes('Invalid user role')) {
        throw error;
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseToken');
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          await fetchUserData(user);
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
        localStorage.removeItem('firebaseToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    logout,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
