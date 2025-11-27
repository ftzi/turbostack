"use client"

export default function GlobalErrorPage({
	reset,
}: {
	error: globalThis.Error & { digest?: string }
	reset: () => void
}): React.ReactElement {
	return (
		<html lang="en">
			<body>
				<div
					style={{
						display: "flex",
						minHeight: "100vh",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						padding: "1rem",
						fontFamily: "system-ui, sans-serif",
					}}
				>
					<div style={{ textAlign: "center" }}>
						<p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ef4444" }}>Critical Error</p>
						<h1 style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: 700 }}>Something went wrong</h1>
						<p style={{ marginTop: "1rem", color: "#6b7280" }}>
							A critical error occurred. Please refresh the page or try again later.
						</p>
						<div style={{ marginTop: "2rem" }}>
							<button
								type="button"
								onClick={reset}
								style={{
									padding: "0.5rem 1rem",
									fontSize: "0.875rem",
									fontWeight: 500,
									color: "white",
									backgroundColor: "#3b82f6",
									border: "none",
									borderRadius: "0.375rem",
									cursor: "pointer",
								}}
							>
								Try again
							</button>
						</div>
					</div>
				</div>
			</body>
		</html>
	)
}
