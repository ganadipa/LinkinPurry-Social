import * as React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authorization)/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div>Auth layout</div>
      <Outlet />
    </>
  )
}
