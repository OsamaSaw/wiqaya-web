/*
 * Simple in‑memory API service for the Wiqayah admin dashboard.  This module
 * exports asynchronous functions that simulate HTTP requests by working
 * against local arrays.  When you integrate your backend, replace these
 * implementations with calls to your server using axios.  The structure of
 * each method is similar: fetch, create, update, delete.  Note that
 * identifiers are generated using timestamps for simplicity.
 */

import axios from 'axios';
import type {
  User,
  Guard,
  Order,
  Payment,
  Admin,
  Conversation,
  Skill,
} from '../types';

// Dashboard stats interface based on backend API
export interface DashboardStats {
  totalUsers: number;
  totalGuards: number;
  totalClients: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  activeGuards: number;
  activeBookings: number;
  completedToday: number;
  pendingApprovalGuards: number;
}

// User interfaces based on backend API
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'guard' | 'admin';
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  guardProfile?: {
    id: string;
    isVerified: boolean;
    experienceYears: number;
    hourlyRate: number;
    locations: string[];
  };
}

export interface UsersResponse {
  users: ApiUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Booking interfaces based on backend API
export interface ApiBooking {
  id: string;
  client_id: string;
  guard_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  hourly_rate: number;
  total_amount: number;
  location: string;
  period: string;
  special_instructions: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  guardProfile: {
    id: string;
    hourly_rate: number;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

export interface BookingsResponse {
  bookings: ApiBooking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  upcomingCount: number;
  pastCount: number;
}

// Conversation interfaces based on backend API
export interface ApiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  sent_at: string;
  sender: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface ApiConversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  }>;
  messages: ApiMessage[];
  messageCount: number;
  lastMessageAt: string;
}

export interface ConversationsResponse {
  userId: string;
  userDisplayName: string;
  conversations: ApiConversation[];
  totalConversations: number;
  totalMessages: number;
}

// Configure axios instance for your backend
// Update baseURL to match your backend server
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  timeout: 10000,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get Firebase JWT token from your auth context/service
    const token = localStorage.getItem('firebaseToken'); // Adjust based on your auth implementation
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// In‑memory data stores for demo purposes.  These will be replaced by
// remote resources when a real backend is connected.
let users: User[] = [
  { id: 1, name: 'Ahmad', email: 'ahmad@example.com' },
  { id: 2, name: 'Fatimah', email: 'fatimah@example.com' },
];
let guards: Guard[] = [
  { id: 1, name: 'Ali', phone: '+966111111111' },
  { id: 2, name: 'Sara', phone: '+966222222222' },
];
let orders: Order[] = [
  { id: 1, user: 'Ahmad', guard: 'Ali', date: '2025-08-21T15:30', status: 'Scheduled' },
];
let payments: Payment[] = [
  { id: 1, orderId: 1, amount: '500 SAR', date: '2025-08-20', status: 'Paid' },
];
let admins: Admin[] = [
  { id: 1, name: 'Admin', email: 'admin@wiqayah.com', role: 'Super Admin' },
];
let conversations: Conversation[] = [
  { id: 1, user: 'Ahmad', guard: 'Ali', lastMessage: 'Thank you', date: '2025-08-20T12:00' },
];

function generateId(): number {
  return Math.floor(Date.now() * Math.random());
}

const api = {
  // Dashboard Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if API fails during development
      return {
        totalUsers: 1250,
        totalGuards: 850,
        totalClients: 400,
        totalBookings: 3200,
        completedBookings: 2800,
        pendingBookings: 45,
        cancelledBookings: 355,
        totalRevenue: 125000.50,
        monthlyRevenue: 15000.25,
        newUsersThisMonth: 85,
        activeGuards: 650,
        activeBookings: 120,
        completedToday: 25,
        pendingApprovalGuards: 12
      };
    }
  },

  // Users Management - Connected to Backend API
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'client' | 'guard' | 'admin';
  } = {}): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      
      const response = await axiosInstance.get(`/admin/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data structure
      return {
        users: [
          {
            id: '1',
            email: 'ahmad@example.com',
            firstName: 'Ahmad',
            lastName: 'Al-Rashid',
            role: 'client',
            status: 'active',
            isVerified: true,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:22:00Z',
            lastLoginAt: '2024-01-22T09:15:00Z'
          },
          {
            id: '2',
            email: 'fatimah@example.com',
            firstName: 'Fatimah',
            lastName: 'Al-Zahra',
            role: 'guard',
            status: 'active',
            isVerified: true,
            createdAt: '2024-01-10T08:20:00Z',
            updatedAt: '2024-01-21T16:45:00Z',
            lastLoginAt: '2024-01-23T11:30:00Z',
            guardProfile: {
              id: 'guard-1',
              isVerified: true,
              experienceYears: 5,
              hourlyRate: 25.50,
              locations: ['Riyadh', 'Jeddah']
            }
          }
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1
      };
    }
  },

  async updateUserRole(userId: string, role: 'client' | 'guard' | 'admin'): Promise<void> {
    try {
      await axiosInstance.put(`/admin/users/${userId}/role`, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  async updateUserStatus(userId: string, active: boolean): Promise<void> {
    try {
      await axiosInstance.put(`/admin/users/${userId}/status`, { active });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Bookings Management - Connected to Backend API
  async getBookings(params: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    search?: string;
  } = {}): Promise<BookingsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await axiosInstance.get(`/admin/bookings?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to mock data structure
      return {
        bookings: [
          {
            id: 'booking-1',
            client_id: 'client-1',
            guard_id: 'guard-1',
            status: 'confirmed',
            hourly_rate: 25.50,
            total_amount: 204.00,
            location: '123 Main St, Riyadh, Saudi Arabia',
            period: '["2024-01-01T09:00:00.000Z","2024-01-01T17:00:00.000Z"]',
            special_instructions: 'Please arrive 15 minutes early',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:22:00Z',
            user: {
              id: 'client-1',
              email: 'client@example.com',
              first_name: 'Ahmad',
              last_name: 'Al-Rashid'
            },
            guardProfile: {
              id: 'guard-1',
              hourly_rate: 25.50,
              user: {
                id: 'guard-user-1',
                email: 'guard@example.com',
                first_name: 'Fatimah',
                last_name: 'Al-Zahra'
              }
            }
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        upcomingCount: 1,
        pastCount: 0
      };
    }
  },

  async updateBookingStatus(bookingId: string, status: string, notes?: string): Promise<ApiBooking> {
    try {
      const response = await axiosInstance.put(`/admin/bookings/${bookingId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Guards (filtered users with role='guard')
  async getGuards(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<UsersResponse> {
    return this.getUsers({ ...params, role: 'guard' });
  },

  // Conversations Management - Connected to Backend API
  async getConversations(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{
    conversations: ApiConversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      
      const response = await axiosInstance.get(`/admin/conversations?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to mock data structure
      return {
        conversations: [
          {
            id: 'conv-1',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:22:00Z',
            participants: [
              {
                id: 'user-1',
                email: 'ahmad@example.com',
                first_name: 'Ahmad',
                last_name: 'Al-Rashid',
                role: 'client'
              },
              {
                id: 'user-2',
                email: 'guard@example.com',
                first_name: 'Fatimah',
                last_name: 'Al-Zahra',
                role: 'guard'
              }
            ],
            messages: [
              {
                id: 'msg-1',
                conversation_id: 'conv-1',
                sender_id: 'user-1',
                body: 'Hi, I need security for my event on Saturday.',
                sent_at: '2024-01-15T10:30:00Z',
                sender: {
                  id: 'user-1',
                  email: 'ahmad@example.com',
                  first_name: 'Ahmad',
                  last_name: 'Al-Rashid',
                  role: 'client'
                }
              }
            ],
            messageCount: 1,
            lastMessageAt: '2024-01-15T10:30:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1
      };
    }
  },

  async getUserConversations(userId: string): Promise<ConversationsResponse> {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      // Fallback to mock data structure
      return {
        userId: userId,
        userDisplayName: 'Ahmad Al-Rashid (client)',
        conversations: [
          {
            id: 'conv-1',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:22:00Z',
            participants: [
              {
                id: 'user-1',
                email: 'ahmad@example.com',
                first_name: 'Ahmad',
                last_name: 'Al-Rashid',
                role: 'client'
              },
              {
                id: 'user-2',
                email: 'guard@example.com',
                first_name: 'Fatimah',
                last_name: 'Al-Zahra',
                role: 'guard'
              }
            ],
            messages: [
              {
                id: 'msg-1',
                conversation_id: 'conv-1',
                sender_id: 'user-1',
                body: 'Hi, I need security for my event on Saturday.',
                sent_at: '2024-01-15T10:30:00Z',
                sender: {
                  id: 'user-1',
                  email: 'ahmad@example.com',
                  first_name: 'Ahmad',
                  last_name: 'Al-Rashid',
                  role: 'client'
                }
              }
            ],
            messageCount: 1,
            lastMessageAt: '2024-01-15T10:30:00Z'
          }
        ],
        totalConversations: 1,
        totalMessages: 1
      };
    }
  },

  // Skills Management - Connected to Backend API
  async getSkills(): Promise<Skill[]> {
    try {
      const response = await axiosInstance.get('/guards/skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Fallback to mock data structure
      return [
        { id: 1, name: 'Security Guard' },
        { id: 2, name: 'Armed Security' },
        { id: 3, name: 'Event Security' },
        { id: 4, name: 'Corporate Security' },
        { id: 5, name: 'Residential Security' }
      ];
    }
  },

  async createSkill(data: { name: string }): Promise<Skill> {
    try {
      const response = await axiosInstance.post('/guards/skills', data);
      return response.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // Authentication
  async login(email: string, password: string): Promise<{ token: string }> {
    // Replace this with real authentication call
    if (!email || !password) throw new Error('Missing credentials');
    return { token: 'dummy-token' };
  },

  // Legacy methods for backward compatibility (will be deprecated)
  // Users (Old API)
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const newUser: User = { id: generateId(), ...data };
    users.push(newUser);
    return newUser;
  },

  async updateUser(id: number, data: Partial<Omit<User, 'id'>>): Promise<User> {
    users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    const updated = users.find((u) => u.id === id);
    if (!updated) throw new Error('User not found');
    return updated;
  },

  // Guards (Old API)
  async createGuard(data: Omit<Guard, 'id'>): Promise<Guard> {
    const newGuard: Guard = { id: generateId(), ...data };
    guards.push(newGuard);
    return newGuard;
  },

  async updateGuard(id: number, data: Partial<Omit<Guard, 'id'>>): Promise<Guard> {
    guards = guards.map((g) => (g.id === id ? { ...g, ...data } : g));
    const updated = guards.find((g) => g.id === id);
    if (!updated) throw new Error('Guard not found');
    return updated;
  },

  async deleteGuard(id: number): Promise<void> {
    guards = guards.filter((g) => g.id !== id);
  },

  // Orders (Old API)
  async getOrders(): Promise<Order[]> {
    return [...orders];
  },

  async createOrder(data: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = { id: generateId(), ...data };
    orders.push(newOrder);
    return newOrder;
  },

  async updateOrder(id: number, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
    orders = orders.map((o) => (o.id === id ? { ...o, ...data } : o));
    const updated = orders.find((o) => o.id === id);
    if (!updated) throw new Error('Order not found');
    return updated;
  },

  async deleteOrder(id: number): Promise<void> {
    orders = orders.filter((o) => o.id !== id);
  },

  // Payments (Old API)
  async getPayments(): Promise<Payment[]> {
    return [...payments];
  },

  async createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
    const newPayment: Payment = { id: generateId(), ...data };
    payments.push(newPayment);
    return newPayment;
  },

  async updatePayment(id: number, data: Partial<Omit<Payment, 'id'>>): Promise<Payment> {
    payments = payments.map((p) => (p.id === id ? { ...p, ...data } : p));
    const updated = payments.find((p) => p.id === id);
    if (!updated) throw new Error('Payment not found');
    return updated;
  },

  async deletePayment(id: number): Promise<void> {
    payments = payments.filter((p) => p.id !== id);
  },

  // Admins (Old API)
  async getAdmins(): Promise<Admin[]> {
    return [...admins];
  },

  async createAdmin(data: Omit<Admin, 'id'>): Promise<Admin> {
    const newAdmin: Admin = { id: generateId(), ...data };
    admins.push(newAdmin);
    return newAdmin;
  },

  async updateAdmin(id: number, data: Partial<Omit<Admin, 'id'>>): Promise<Admin> {
    admins = admins.map((a) => (a.id === id ? { ...a, ...data } : a));
    const updated = admins.find((a) => a.id === id);
    if (!updated) throw new Error('Admin not found');
    return updated;
  },

  async deleteAdmin(id: number): Promise<void> {
    admins = admins.filter((a) => a.id !== id);
  },

  // Conversations (Old API - Legacy)
  async getConversationsLegacy(): Promise<Conversation[]> {
    return [...conversations];
  },

  async createConversation(data: Omit<Conversation, 'id'>): Promise<Conversation> {
    const newConv: Conversation = { id: generateId(), ...data };
    conversations.push(newConv);
    return newConv;
  },

  async updateConversation(id: number, data: Partial<Omit<Conversation, 'id'>>): Promise<Conversation> {
    conversations = conversations.map((c) => (c.id === id ? { ...c, ...data } : c));
    const updated = conversations.find((c) => c.id === id);
    if (!updated) throw new Error('Conversation not found');
    return updated;
  },

  async deleteConversation(id: number): Promise<void> {
    conversations = conversations.filter((c) => c.id !== id);
  },

};

export default api;