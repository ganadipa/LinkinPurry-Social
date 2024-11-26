import { createFileRoute } from '@tanstack/react-router'
import ConnectionsPage from '@/pages/ConnectionsPage'

export const Route = createFileRoute('/(public)/connections')({
  component: ConnectionsPage,
})
