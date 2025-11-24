import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "../serverConsts.js";
import * as schema from "./schema.js";

const sql = neon(serverEnv.DATABASE_URL);

export const db = drizzle({ client: sql, schema });
