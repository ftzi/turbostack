import "server-only"
import { neon } from "@neondatabase/serverless"
import Database from "better-sqlite3"
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3"
import { drizzle as drizzlePg } from "drizzle-orm/neon-http"
import { serverEnv } from "../env"
import * as schemaPg from "./schema"
import * as schemaSqlite from "./schema.sqlite"

let _db: any

function getDb() {
    if (_db) return _db

    if (serverEnv.DB_CLIENT === "sqlite") {
        const url = serverEnv.DATABASE_URL.startsWith("file:")
            ? serverEnv.DATABASE_URL.slice(5)
            : serverEnv.DATABASE_URL
        const sqlite = new Database(url)
        _db = drizzleSqlite(sqlite, { schema: schemaSqlite })
    } else {
        const sql = neon(serverEnv.DATABASE_URL)
        _db = drizzlePg({ client: sql, schema: schemaPg })
    }
    return _db
}

export const db = new Proxy({} as any, {
    get(_target, prop) {
        return (getDb() as any)[prop]
    },
})

export const schema = new Proxy({} as any, {
    get(_target, prop) {
        if (serverEnv.DB_CLIENT === "sqlite") return (schemaSqlite as any)[prop]
        return (schemaPg as any)[prop]
    },
})
