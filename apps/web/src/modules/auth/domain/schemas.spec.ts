import { describe, expect, it } from "vitest";
import type { ZodError } from "zod";
import authPtBR from "@/shared/i18n/locales/pt-BR/auth.json";
import { buildRegisterSchema, buildSignInSchema } from "./schemas";

// The builders resolve i18n at call time, so the expected copy is read from the
// pt-BR JSON itself — a hardcoded duplicate here would silently drift from the
// locale the user actually sees. (`src/test/setup.ts` pins the language.)
const signInCopy = authPtBR.signIn;
const registerCopy = authPtBR.register;

const STRONG_PASSWORD = "Senha@123";

const INVALID_EMAILS: [string, string][] = [
  ["an empty", ""],
  ["a whitespace-only", "   "],
  ["a truncated", "ana@"],
  ["a dotless-domain", "ana@test"],
  ["an @-less", "ana.test.com"],
];

function issuesFor(error: ZodError, field: string) {
  return error.issues.filter((issue) => issue.path.join(".") === field);
}

describe("buildSignInSchema", () => {
  it.each(INVALID_EMAILS)("rejects %s e-mail with the sign-in message", (_label, email) => {
    const result = buildSignInSchema().safeParse({ email, password: "whatever" });

    expect(result.success).toBe(false);
    if (result.success) return;
    const emailIssues = issuesFor(result.error, "email");
    expect(emailIssues.length).toBeGreaterThan(0);
    // Both the presence and the format check share one message so the form
    // never flips copy while the user types.
    expect(emailIssues[0]?.message).toBe(signInCopy.emailRequired);
  });

  it("accepts a valid e-mail and returns it trimmed", () => {
    // A trailing space pasted from a password manager must not reach the API
    // as part of the lookup key.
    const result = buildSignInSchema().safeParse({
      email: "  ana@test.com  ",
      password: "qualquer",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("ana@test.com");
  });

  it("rejects an empty password with the sign-in message", () => {
    const result = buildSignInSchema().safeParse({ email: "ana@test.com", password: "" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(issuesFor(result.error, "password")[0]?.message).toBe(signInCopy.passwordRequired);
  });

  it("does not apply the strength rules to an existing password", () => {
    // Sign-in must accept whatever the account was created with. Enforcing the
    // register-time policy here locks out every user whose password predates it.
    const result = buildSignInSchema().safeParse({ email: "ana@test.com", password: "a" });

    expect(result.success).toBe(true);
  });
});

describe("buildRegisterSchema", () => {
  it.each([
    ["an empty", ""],
    ["a whitespace-only", "   "],
  ])("rejects %s name with the register message", (_label, name) => {
    const result = buildRegisterSchema().safeParse({
      name,
      email: "ana@test.com",
      password: STRONG_PASSWORD,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(issuesFor(result.error, "name")[0]?.message).toBe(registerCopy.nameRequired);
  });

  it.each(INVALID_EMAILS)("rejects %s e-mail with the register message", (_label, email) => {
    const result = buildRegisterSchema().safeParse({
      name: "Ana",
      email,
      password: STRONG_PASSWORD,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    const emailIssues = issuesFor(result.error, "email");
    expect(emailIssues.length).toBeGreaterThan(0);
    expect(emailIssues[0]?.message).toBe(registerCopy.emailRequired);
  });

  it("reports the required message first for an empty password", () => {
    const result = buildRegisterSchema().safeParse({
      name: "Ana",
      email: "ana@test.com",
      password: "",
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    // The strength refinement also fires on an empty value, so the field
    // carries both issues. Form resolvers surface the FIRST one per field, and
    // "required" must win over "weak" for an untouched field.
    expect(issuesFor(result.error, "password")[0]?.message).toBe(registerCopy.passwordRequired);
  });

  it.each([
    ["too short", "Ab@1"],
    ["missing an uppercase letter", "senha@123"],
    ["missing a lowercase letter", "SENHA@123"],
    ["missing a digit", "Senha@abc"],
    ["missing a symbol", "Senha1234"],
  ])("rejects a password %s with the weak message", (_label, password) => {
    const result = buildRegisterSchema().safeParse({
      name: "Ana",
      email: "ana@test.com",
      password,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(issuesFor(result.error, "password").map((issue) => issue.message)).toEqual([
      registerCopy.passwordWeak,
    ]);
    // The other fields are valid — a weak password must not smear errors onto them.
    expect(issuesFor(result.error, "name")).toHaveLength(0);
    expect(issuesFor(result.error, "email")).toHaveLength(0);
  });

  it("accepts a complete registration and trims only the identity fields", () => {
    // Trimming the password would silently change the credential the user
    // typed, so it must survive verbatim while name and e-mail are normalized.
    const result = buildRegisterSchema().safeParse({
      name: "  Ana Teste  ",
      email: "  ana@test.com  ",
      password: ` ${STRONG_PASSWORD} `,
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      name: "Ana Teste",
      email: "ana@test.com",
      password: ` ${STRONG_PASSWORD} `,
    });
  });
});
