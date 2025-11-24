/**
 * Extracts a user-friendly error message from an unknown error object.
 *
 * Use this for displaying error messages to users (e.g., toasts, alerts).
 * For logging with Pino, pass the error object directly to the logger.
 *
 * @param error - The error object (unknown type from catch blocks)
 * @param fallbackMessage - Message to return if error extraction fails
 * @returns A string representation of the error message
 *
 * @example
 * ```typescript
 * try {
 *   await someOperation()
 * } catch (error) {
 *   // For user-facing error messages
 *   const message = getErrorMessage(error, "Operation failed")
 *   toast({ title: message, variant: "destructive" })
 *
 *   // For logging, pass error directly to Pino
 *   logger.error({ err: error }, "Operation failed")
 * }
 * ```
 */
export const getErrorMessage = (error: unknown, fallbackMessage = "An error happened"): string => {
	if (typeof error === "string") {
		return error
	}

	if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
		return error.message
	}

	return fallbackMessage
}
