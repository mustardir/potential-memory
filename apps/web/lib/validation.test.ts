import { describe, expect, it } from "vitest";
import { investmentSchema, loginSchema, registerSchema, transactionSchema } from "@/lib/validation";

describe("validation schemas", () => {
  it("validates login payload", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid login payload", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "short" });
    expect(result.success).toBe(false);
  });

  it("validates register payload", () => {
    const result = registerSchema.safeParse({ firstName: "Alice", lastName: "Smith", email: "alice@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid register payload", () => {
    const result = registerSchema.safeParse({ firstName: "", lastName: "Smith", email: "alice@", password: "123" });
    expect(result.success).toBe(false);
  });

  it("validates transaction payload", () => {
    const result = transactionSchema.safeParse({ type: "DEPOSIT", amount: 100, currency: "USD" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid transaction payload", () => {
    const result = transactionSchema.safeParse({ type: "INVALID", amount: -10 });
    expect(result.success).toBe(false);
  });

  it("validates investment payload", () => {
    const result = investmentSchema.safeParse({ name: "Growth fund", principalAmount: 1000, returnRate: 2.5, startDate: "2026-01-01", maturityDate: "2026-12-31", currency: "USD" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid investment payload", () => {
    const result = investmentSchema.safeParse({ name: "", principalAmount: 0 });
    expect(result.success).toBe(false);
  });
});
