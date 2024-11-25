import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Profile from '@/pages/Profile'

export const Route = createFileRoute('/(profile)/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Profile />
}
