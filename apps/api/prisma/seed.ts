/* eslint-disable no-console -- CLI script: console output is the intended UX */
/**
 * Development seed — minimal boilerplate.
 *
 * Run: yarn seed (or `npx tsx prisma/seed.ts`)
 *
 * Creates two demo users so you can sign in immediately after wiring up the
 * database (and so the dev quick-login panel has something to switch to):
 *
 *   · email:    demo@example.com · qa@example.com
 *   · password: Demo1234!
 *
 * The password is hashed with bcrypt (SALT_ROUNDS = 10) at seed time — the
 * same algorithm the runtime `BcryptHashProvider` uses — so the demo
 * credentials work through the normal sign-in flow. The seed is idempotent:
 * it upserts on the unique `email`.
 */
import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Demo1234!";

const DEMO_USERS = [
  { name: "Demo User", email: "demo@example.com" },
  { name: "QA User", email: "qa@example.com" },
];

async function main(): Promise<void> {
  // These accounts have a PUBLIC password — never create them where real
  // users live. An allowlist on purpose: an unset or unexpected NODE_ENV must
  // not read as "safe" (`apps/api/.env.example` sets `local`).
  const nodeEnv = process.env.NODE_ENV ?? "";
  if (!["local", "test"].includes(nodeEnv)) {
    throw new Error(
      `Refusing to seed demo users with NODE_ENV="${nodeEnv}" — only "local" and "test" are allowed`,
    );
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const demo of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {},
      create: {
        name: demo.name,
        email: demo.email,
        password: passwordHash,
        status: "ACTIVE",
        email_verified: true,
        language: "pt-BR",
      },
    });

    console.log(`Seeded user: ${user.email} (password: ${DEMO_PASSWORD})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
