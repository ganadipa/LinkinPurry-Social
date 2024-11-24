import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authorization)/_auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /signin!'
}
