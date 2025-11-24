import "server-only"
import { neon } from "@neondatabase/serverless"
import { serverEnv } from "@workspace/shared/server-consts"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const sql = neon(serverEnv.DATABASE_URL)

export const db = drizzle({ client: sql, schema })
