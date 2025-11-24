import { describe, expect, test } from "bun:test"
import { call } from "@orpc/server"
import { ping } from "./ping.handler"

describe("ping handler", () => {
	test("returns pong message with timestamp", async () => {
		const result = await call(ping, {}, { context: { headers: new Headers() } })

		expect(result).toHaveProperty("message", "pong")
		expect(result).toHaveProperty("timestamp")
		expect(typeof result.timestamp).toBe("number")
		expect(result.timestamp).toBeLessThanOrEqual(Date.now())
	})

	test("timestamp is close to current time", async () => {
		const beforeTime = Date.now()
		const result = await call(ping, {}, { context: { headers: new Headers() } })
		const afterTime = Date.now()

		expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime)
		expect(result.timestamp).toBeLessThanOrEqual(afterTime)
	})

	test("returns correct message", async () => {
		const result = await call(ping, {}, { context: { headers: new Headers() } })

		expect(result.message).toBe("pong")
	})
})
