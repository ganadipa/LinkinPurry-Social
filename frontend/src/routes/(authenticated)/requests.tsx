import { createFileRoute } from '@tanstack/react-router'
import ConnectionRequestsPage from '@/pages/ConnectionRequestsPage'

export const Route = createFileRoute('/(authenticated)/requests')({
  component: ConnectionRequestsPage,
})
