/**
 * Get the next 30-minute interval from a given date
 * Examples:
 * - 15:24 -> 15:30
 * - 16:48 -> 17:00
 * - 23:58 -> 00:00 (next day)
 * - 14:30:00 -> 14:30:00 (if exactly on 30-min mark)
 *
 * @param date - The base date to calculate from (defaults to current time)
 * @returns A new Date object set to the next 30-minute interval
 */
export function getNext30MinuteInterval(date: Date = new Date()): Date {
	const result = new Date(date)
	const minutes = result.getMinutes()
	const seconds = result.getSeconds()
	const milliseconds = result.getMilliseconds()

	// If we're exactly on a 30-minute mark with no seconds/milliseconds, use current time
	if ((minutes === 0 || minutes === 30) && seconds === 0 && milliseconds === 0) {
		return result
	}

	// Calculate next 30-minute interval
	let nextMinutes: number
	if (minutes < 30) {
		nextMinutes = 30
	} else {
		nextMinutes = 0
		result.setHours(result.getHours() + 1)
	}

	result.setMinutes(nextMinutes, 0, 0) // Set minutes, seconds=0, milliseconds=0

	// Handle day rollover (e.g., 23:58 -> next day 00:00)
	if (result.getHours() === 24) {
		result.setDate(result.getDate() + 1)
		result.setHours(0)
	}

	return result
}

/**
 * Format a date for datetime-local input
 * @param date - The date to format
 * @returns String in YYYY-MM-DDTHH:MM format
 */
export function formatDateTimeLocal(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")
	return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Format a date for date input
 * @param date - The date to format
 * @returns String in YYYY-MM-DD format
 */
export function formatDateLocal(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}
