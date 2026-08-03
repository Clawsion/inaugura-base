// ============================================================================
// auth.test.ts — Testes do auth (hash password, sessions)
// ============================================================================
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("Password hashing", () => {
  it("hashPassword devolve string não vazia diferente do input", () => {
    const hash = hashPassword("mypassword123");
    expect(hash).toBeTruthy();
    expect(hash).not.toBe("mypassword123");
    expect(hash.startsWith("pbkdf2$")).toBe(true);
  });

  it("hashPassword gera hashes diferentes para o mesmo input (salt random)", () => {
    const h1 = hashPassword("mypassword123");
    const h2 = hashPassword("mypassword123");
    expect(h1).not.toBe(h2); // salts diferentes
  });

  it("verifyPassword aceita password correta", () => {
    const hash = hashPassword("mypassword123");
    expect(verifyPassword("mypassword123", hash)).toBe(true);
  });

  it("verifyPassword rejeita password errada", () => {
    const hash = hashPassword("mypassword123");
    expect(verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("verifyPassword rejeita hash malformado", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
    expect(verifyPassword("anything", "")).toBe(false);
    expect(verifyPassword("anything", "pbkdf2$bad")).toBe(false);
  });
});
