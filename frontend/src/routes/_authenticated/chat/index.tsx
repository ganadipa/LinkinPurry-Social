import ChatPage from '@/pages/chat/chat-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/chat/')({
  component: ChatPage,
})
