import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/pages/ProfilePage'

export const Route = createFileRoute('/(public)/profile/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
  return <ProfilePage id={Number(id)} />
}
