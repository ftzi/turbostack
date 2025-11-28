import "@workspace/ui/globals.css"
import { NextbookShell } from "@workspace/nextbook"
import type { Metadata } from "next"
import { storyTree } from "./stories"

export const metadata: Metadata = {
	title: "Nextbook | Component Stories",
	description: "Browse and interact with UI components",
}

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
	return <NextbookShell tree={storyTree}>{children}</NextbookShell>
}
