export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Account {
  id: string;
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: "credit" | "debit";
}
