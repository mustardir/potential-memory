// Authentication

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

// User

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard

export interface DashboardCard {
  title: string;
  value: string | number;
  description?: string;
}

// Accounts

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

// Transactions

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
}

// Theme

export interface Theme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

// UI Components

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export interface CardProps {
  children: React.ReactNode;
}

// API

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
