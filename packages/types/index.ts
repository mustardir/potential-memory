export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export interface CreateAccountRequest {
  userId: string;
  accountType: "SAVINGS" | "CURRENT";
}

export interface TransferFundsRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
