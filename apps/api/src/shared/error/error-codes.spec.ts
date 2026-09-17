import { readFileSync } from "node:fs";
import path from "node:path";
import { ErrorCodes } from "./error-codes";

const LOCALES = ["pt-BR", "en", "es"] as const;

function loadErrorsLocale(
  locale: (typeof LOCALES)[number],
): Record<string, string> {
  const file = path.resolve(
    __dirname,
    "../i18n/locales",
    locale,
    "errors.json",
  );
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
}

describe("ErrorCodes", () => {
  it("every value equals its key (the code IS the wire string)", () => {
    for (const [key, value] of Object.entries(ErrorCodes)) {
      expect(typeof value).toBe("string");
      expect(value).toBe(key);
    }
  });

  it("keeps the generic fallback and the transport-level defaults", () => {
    expect(ErrorCodes.GENERIC_ERROR).toBe("GENERIC_ERROR");
    expect(ErrorCodes.BAD_REQUEST).toBe("BAD_REQUEST");
    expect(ErrorCodes.UNAUTHORIZED).toBe("UNAUTHORIZED");
    expect(ErrorCodes.FORBIDDEN).toBe("FORBIDDEN");
    expect(ErrorCodes.NOT_FOUND).toBe("NOT_FOUND");
    expect(ErrorCodes.CONFLICT).toBe("CONFLICT");
    expect(ErrorCodes.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
    expect(ErrorCodes.TOO_MANY_REQUESTS).toBe("TOO_MANY_REQUESTS");
    expect(ErrorCodes.RATE_LIMIT).toBe("RATE_LIMIT");
    expect(ErrorCodes.INTERNAL_ERROR).toBe("INTERNAL_ERROR");
    expect(ErrorCodes.SERVICE_UNAVAILABLE).toBe("SERVICE_UNAVAILABLE");
  });

  it("keeps the auth family", () => {
    expect(ErrorCodes.AUTH_INVALID_CREDENTIALS).toBe(
      "AUTH_INVALID_CREDENTIALS",
    );
    expect(ErrorCodes.AUTH_TOKEN_EXPIRED).toBe("AUTH_TOKEN_EXPIRED");
    expect(ErrorCodes.AUTH_TOKEN_INVALID).toBe("AUTH_TOKEN_INVALID");
    expect(ErrorCodes.AUTH_TOKEN_REVOKED).toBe("AUTH_TOKEN_REVOKED");
    expect(ErrorCodes.AUTH_NO_TOKEN).toBe("AUTH_NO_TOKEN");
    expect(ErrorCodes.AUTH_EMAIL_ALREADY_EXISTS).toBe(
      "AUTH_EMAIL_ALREADY_EXISTS",
    );
    expect(ErrorCodes.AUTH_GOOGLE_ONLY).toBe("AUTH_GOOGLE_ONLY");
    expect(ErrorCodes.AUTH_GOOGLE_TOKEN_INVALID).toBe(
      "AUTH_GOOGLE_TOKEN_INVALID",
    );
    expect(ErrorCodes.AUTH_PASSWORD_RESET_TOKEN_INVALID).toBe(
      "AUTH_PASSWORD_RESET_TOKEN_INVALID",
    );
    expect(ErrorCodes.AUTH_PASSWORD_RESET_TOKEN_EXPIRED).toBe(
      "AUTH_PASSWORD_RESET_TOKEN_EXPIRED",
    );
    expect(ErrorCodes.AUTH_PASSWORD_RESET_TOKEN_USED).toBe(
      "AUTH_PASSWORD_RESET_TOKEN_USED",
    );
    expect(ErrorCodes.AUTH_EMAIL_VERIFICATION_PIN_INVALID).toBe(
      "AUTH_EMAIL_VERIFICATION_PIN_INVALID",
    );
    expect(ErrorCodes.AUTH_EMAIL_VERIFICATION_PIN_EXPIRED).toBe(
      "AUTH_EMAIL_VERIFICATION_PIN_EXPIRED",
    );
    expect(ErrorCodes.AUTH_EMAIL_VERIFICATION_RATE_LIMITED).toBe(
      "AUTH_EMAIL_VERIFICATION_RATE_LIMITED",
    );
    expect(ErrorCodes.AUTH_EMAIL_ALREADY_VERIFIED).toBe(
      "AUTH_EMAIL_ALREADY_VERIFIED",
    );
  });

  it("keeps the user, account, file, infrastructure and rate-limit families", () => {
    expect(ErrorCodes.USER_NOT_FOUND).toBe("USER_NOT_FOUND");
    expect(ErrorCodes.ACCOUNT_BLOCKED).toBe("ACCOUNT_BLOCKED");
    expect(ErrorCodes.FILE_REQUIRED).toBe("FILE_REQUIRED");
    expect(ErrorCodes.FILE_INVALID_TYPE).toBe("FILE_INVALID_TYPE");
    expect(ErrorCodes.FILE_UPLOAD_FAILED).toBe("FILE_UPLOAD_FAILED");
    expect(ErrorCodes.FILE_DOWNLOAD_FAILED).toBe("FILE_DOWNLOAD_FAILED");
    expect(ErrorCodes.QUEUE_NOT_FOUND).toBe("QUEUE_NOT_FOUND");
    expect(ErrorCodes.MAIL_SEND_FAILED).toBe("MAIL_SEND_FAILED");
    expect(ErrorCodes.AUTH_RATE_LIMIT).toBe("AUTH_RATE_LIMIT");
    expect(ErrorCodes.PUBLIC_RATE_LIMIT).toBe("PUBLIC_RATE_LIMIT");
  });

  it("carries exactly the 36 codes the API emits (a code nothing throws is a lie the client may branch on)", () => {
    expect(Object.keys(ErrorCodes)).toHaveLength(36);
  });

  describe("locale parity", () => {
    it.each(LOCALES)(
      "%s/errors.json translates every code and carries no orphan key",
      (locale) => {
        const messages = loadErrorsLocale(locale);
        const codes = Object.keys(ErrorCodes);

        const untranslated = codes.filter((code) => !messages[code]);
        const orphans = Object.keys(messages).filter(
          (key) => !(key in ErrorCodes),
        );

        expect(untranslated).toEqual([]);
        expect(orphans).toEqual([]);
      },
    );
  });
});
