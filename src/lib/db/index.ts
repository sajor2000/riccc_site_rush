import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | null = null;

/** True when DATABASE_URL is configured (production / local with Neon). */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Return a Drizzle client for Neon HTTP, or null when DATABASE_URL is unset.
 * Callers should fall back to email-only behavior when null.
 */
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (cached) return cached;
  const sql = neon(url);
  cached = drizzle(sql, { schema });
  return cached;
}
