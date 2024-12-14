import FeedPage from '@/pages/feed-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: FeedPage,
})
