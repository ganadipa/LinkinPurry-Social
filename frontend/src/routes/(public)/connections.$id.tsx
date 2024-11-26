import { createFileRoute } from '@tanstack/react-router'
import ConnectionsPage from '@/pages/ConnectionsPage'

export const Route = createFileRoute('/(public)/connections/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams() as { id?: string }
  return <ConnectionsPage id={id ? Number(id) : undefined} />
}
