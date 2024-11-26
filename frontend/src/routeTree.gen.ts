/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as publicIndexImport } from './routes/(public)/index'
import { Route as publicUsersImport } from './routes/(public)/users'
import { Route as profileProfileImport } from './routes/(profile)/profile'
import { Route as authenticatedRequestsImport } from './routes/(authenticated)/requests'
import { Route as publicConnectionsImport } from './routes/(public)/connections'
import { Route as authorizationAuthImport } from './routes/(authorization)/_auth'
import { Route as authorizationAuthSignupImport } from './routes/(authorization)/_auth/signup'
import { Route as authorizationAuthSigninImport } from './routes/(authorization)/_auth/signin'

// Create Virtual Routes

const authorizationImport = createFileRoute('/(authorization)')()

// Create/Update Routes

const authorizationRoute = authorizationImport.update({
  id: '/(authorization)',
  getParentRoute: () => rootRoute,
} as any)

const publicIndexRoute = publicIndexImport.update({
  id: '/(public)/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const publicUsersRoute = publicUsersImport.update({
  id: '/(public)/users',
  path: '/users',
  getParentRoute: () => rootRoute,
} as any)

const profileProfileRoute = profileProfileImport.update({
  id: '/(profile)/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const authenticatedRequestsRoute = authenticatedRequestsImport.update({
  id: '/(authenticated)/requests',
  path: '/requests',
  getParentRoute: () => rootRoute,
} as any)

const publicConnectionsRoute = publicConnectionsImport.update({
  id: '/(public)/connections',
  path: '/connections',
  getParentRoute: () => rootRoute,
} as any)

const authorizationAuthRoute = authorizationAuthImport.update({
  id: '/_auth',
  getParentRoute: () => authorizationRoute,
} as any)

const authorizationAuthSignupRoute = authorizationAuthSignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => authorizationAuthRoute,
} as any)

const authorizationAuthSigninRoute = authorizationAuthSigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => authorizationAuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(authorization)': {
      id: '/(authorization)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authorizationImport
      parentRoute: typeof rootRoute
    }
    '/(authorization)/_auth': {
      id: '/(authorization)/_auth'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authorizationAuthImport
      parentRoute: typeof authorizationRoute
    }
    '/(public)/connections': {
      id: '/(public)/connections'
      path: '/connections'
      fullPath: '/connections'
      preLoaderRoute: typeof connectionConnectionsImport
      parentRoute: typeof rootRoute
    }
    '/(authenticated)/requests': {
      id: '/(authenticated)/requests'
      path: '/requests'
      fullPath: '/requests'
      preLoaderRoute: typeof connectionRequestsImport
      parentRoute: typeof rootRoute
    }
    '/(profile)/profile': {
      id: '/(profile)/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof profileProfileImport
      parentRoute: typeof rootRoute
    }
    '/(public)/users': {
      id: '/(public)/users'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof publicUsersImport
      parentRoute: typeof rootRoute
    }
    '/(public)/': {
      id: '/(public)/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof publicIndexImport
      parentRoute: typeof rootRoute
    }
    '/(authorization)/_auth/signin': {
      id: '/(authorization)/_auth/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof authorizationAuthSigninImport
      parentRoute: typeof authorizationAuthImport
    }
    '/(authorization)/_auth/signup': {
      id: '/(authorization)/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authorizationAuthSignupImport
      parentRoute: typeof authorizationAuthImport
    }
  }
}

// Create and export the route tree

interface authorizationAuthRouteChildren {
  authorizationAuthSigninRoute: typeof authorizationAuthSigninRoute
  authorizationAuthSignupRoute: typeof authorizationAuthSignupRoute
}

const authorizationAuthRouteChildren: authorizationAuthRouteChildren = {
  authorizationAuthSigninRoute: authorizationAuthSigninRoute,
  authorizationAuthSignupRoute: authorizationAuthSignupRoute,
}

const authorizationAuthRouteWithChildren =
  authorizationAuthRoute._addFileChildren(authorizationAuthRouteChildren)

interface authorizationRouteChildren {
  authorizationAuthRoute: typeof authorizationAuthRouteWithChildren
}

const authorizationRouteChildren: authorizationRouteChildren = {
  authorizationAuthRoute: authorizationAuthRouteWithChildren,
}

const authorizationRouteWithChildren = authorizationRoute._addFileChildren(
  authorizationRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof publicIndexRoute
  '/connections': typeof publicConnectionsRoute
  '/requests': typeof authenticatedRequestsRoute
  '/profile': typeof profileProfileRoute
  '/users': typeof publicUsersRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
}

export interface FileRoutesByTo {
  '/': typeof publicIndexRoute
  '/connections': typeof publicConnectionsRoute
  '/requests': typeof authenticatedRequestsRoute
  '/profile': typeof profileProfileRoute
  '/users': typeof publicUsersRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(authorization)': typeof authorizationRouteWithChildren
  '/(authorization)/_auth': typeof authorizationAuthRouteWithChildren
  '/(public)/connections': typeof publicConnectionsRoute
  '/(authenticated)/requests': typeof authenticatedRequestsRoute
  '/(profile)/profile': typeof profileProfileRoute
  '/(public)/users': typeof publicUsersRoute
  '/(public)/': typeof publicIndexRoute
  '/(authorization)/_auth/signin': typeof authorizationAuthSigninRoute
  '/(authorization)/_auth/signup': typeof authorizationAuthSignupRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/connections'
    | '/requests'
    | '/profile'
    | '/users'
    | '/signin'
    | '/signup'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/connections'
    | '/requests'
    | '/profile'
    | '/users'
    | '/signin'
    | '/signup'
  id:
    | '__root__'
    | '/(authorization)'
    | '/(authorization)/_auth'
    | '/(public)/connections'
    | '/(authenticated)/requests'
    | '/(profile)/profile'
    | '/(public)/users'
    | '/(public)/'
    | '/(authorization)/_auth/signin'
    | '/(authorization)/_auth/signup'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authorizationRoute: typeof authorizationRouteWithChildren
  publicConnectionsRoute: typeof publicConnectionsRoute
  authenticatedRequestsRoute: typeof authenticatedRequestsRoute
  profileProfileRoute: typeof profileProfileRoute
  publicUsersRoute: typeof publicUsersRoute
  publicIndexRoute: typeof publicIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  authorizationRoute: authorizationRouteWithChildren,
  publicConnectionsRoute: publicConnectionsRoute,
  authenticatedRequestsRoute: authenticatedRequestsRoute,
  profileProfileRoute: profileProfileRoute,
  publicUsersRoute: publicUsersRoute,
  publicIndexRoute: publicIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(authorization)",
        "/(public)/connections",
        "/(authenticated)/requests",
        "/(profile)/profile",
        "/(public)/users",
        "/(public)/"
      ]
    },
    "/(authorization)": {
      "filePath": "(authorization)",
      "children": [
        "/(authorization)/_auth"
      ]
    },
    "/(authorization)/_auth": {
      "filePath": "(authorization)/_auth.tsx",
      "parent": "/(authorization)",
      "children": [
        "/(authorization)/_auth/signin",
        "/(authorization)/_auth/signup"
      ]
    },
    "/(public)/connections": {
      "filePath": "(connection)/connections.tsx"
    },
    "/(authenticated)/requests": {
      "filePath": "(connection)/requests.tsx"
    },
    "/(profile)/profile": {
      "filePath": "(profile)/profile.tsx"
    },
    "/(public)/users": {
      "filePath": "(public)/users.tsx"
    },
    "/(public)/": {
      "filePath": "(public)/index.tsx"
    },
    "/(authorization)/_auth/signin": {
      "filePath": "(authorization)/_auth/signin.tsx",
      "parent": "/(authorization)/_auth"
    },
    "/(authorization)/_auth/signup": {
      "filePath": "(authorization)/_auth/signup.tsx",
      "parent": "/(authorization)/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
