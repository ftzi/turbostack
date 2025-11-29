import { StoryPage } from "@workspace/nextbook"
import { loaders, storyTree } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params
	return <StoryPage path={path} storyTree={storyTree} loaders={loaders} />
}
