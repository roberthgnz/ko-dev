import { FeedList } from "./feed/feed-list"

export const ProfileFeed = ({ posts }: { posts: any[] }) => {
  return <FeedList posts={posts} />
}
