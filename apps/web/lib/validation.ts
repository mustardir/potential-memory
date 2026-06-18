import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const transactionSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
  amount: z.number().positive(),
  currency: z.string().min(1).optional().default("USD"),
  description: z.string().max(255).optional(),
  recipientWalletId: z.string().optional(),
});

export const investmentSchema = z.object({
  name: z.string().min(1),
  principalAmount: z.number().positive(),
  returnRate: z.number().nonnegative().optional(),
  startDate: z.string().optional(),
  maturityDate: z.string().optional(),
  currency: z.string().min(1).optional().default("USD"),
  description: z.string().max(500).optional(),
});

export const profileSchema = z.object({
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  occupation: z.string().max(100).optional(),
  nationality: z.string().max(100).optional(),
});
