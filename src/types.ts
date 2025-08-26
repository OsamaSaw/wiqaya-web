/**
 * Shared type definitions for entities managed by the Wiqayah admin dashboard.
 * Defining these interfaces allows TypeScript to enforce correct usage
 * throughout the application and ensures API service methods return
 * predictable structures.
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Guard {
  id: number;
  name: string;
  phone: string;
}

export interface Order {
  id: number;
  user: string;
  guard: string;
  date: string;
  status: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: string;
  date: string;
  status: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Conversation {
  id: number;
  user: string;
  guard: string;
  lastMessage: string;
  date: string;
}

export interface Skill {
  id: number;
  name: string;
  guardProfiles?: GuardProfile[];
}

export interface GuardProfile {
  id: string;
  isVerified: boolean;
  experienceYears: number;
  hourlyRate: number;
  locations: string[];
}
