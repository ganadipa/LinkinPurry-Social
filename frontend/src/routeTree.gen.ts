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
import { Route as authorizationAuthImport } from './routes/(authorization)/_auth'
import { Route as authenticatedRequestsImport } from './routes/(authenticated)/requests'
import { Route as publicProfileIdImport } from './routes/(public)/profile.$id'
import { Route as publicConnectionsIdImport } from './routes/(public)/connections.$id'
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

const authorizationAuthRoute = authorizationAuthImport.update({
  id: '/_auth',
  getParentRoute: () => authorizationRoute,
} as any)

const authenticatedRequestsRoute = authenticatedRequestsImport.update({
  id: '/(authenticated)/requests',
  path: '/requests',
  getParentRoute: () => rootRoute,
} as any)

const publicProfileIdRoute = publicProfileIdImport.update({
  id: '/(public)/profile/$id',
  path: '/profile/$id',
  getParentRoute: () => rootRoute,
} as any)

const publicConnectionsIdRoute = publicConnectionsIdImport.update({
  id: '/(public)/connections/$id',
  path: '/connections/$id',
  getParentRoute: () => rootRoute,
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
    '/(authenticated)/requests': {
      id: '/(authenticated)/requests'
      path: '/requests'
      fullPath: '/requests'
      preLoaderRoute: typeof authenticatedRequestsImport
      parentRoute: typeof rootRoute
    }
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
    '/(public)/connections/$id': {
      id: '/(public)/connections/$id'
      path: '/connections/$id'
      fullPath: '/connections/$id'
      preLoaderRoute: typeof publicConnectionsIdImport
      parentRoute: typeof rootRoute
    }
    '/(public)/profile/$id': {
      id: '/(public)/profile/$id'
      path: '/profile/$id'
      fullPath: '/profile/$id'
      preLoaderRoute: typeof publicProfileIdImport
      parentRoute: typeof rootRoute
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
  '/requests': typeof authenticatedRequestsRoute
  '/': typeof publicIndexRoute
  '/users': typeof publicUsersRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
  '/connections/$id': typeof publicConnectionsIdRoute
  '/profile/$id': typeof publicProfileIdRoute
}

export interface FileRoutesByTo {
  '/requests': typeof authenticatedRequestsRoute
  '/': typeof publicIndexRoute
  '/users': typeof publicUsersRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
  '/connections/$id': typeof publicConnectionsIdRoute
  '/profile/$id': typeof publicProfileIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(authenticated)/requests': typeof authenticatedRequestsRoute
  '/(authorization)': typeof authorizationRouteWithChildren
  '/(authorization)/_auth': typeof authorizationAuthRouteWithChildren
  '/(public)/users': typeof publicUsersRoute
  '/(public)/': typeof publicIndexRoute
  '/(authorization)/_auth/signin': typeof authorizationAuthSigninRoute
  '/(authorization)/_auth/signup': typeof authorizationAuthSignupRoute
  '/(public)/connections/$id': typeof publicConnectionsIdRoute
  '/(public)/profile/$id': typeof publicProfileIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/requests'
    | '/'
    | '/users'
    | '/signin'
    | '/signup'
    | '/connections/$id'
    | '/profile/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/requests'
    | '/'
    | '/users'
    | '/signin'
    | '/signup'
    | '/connections/$id'
    | '/profile/$id'
  id:
    | '__root__'
    | '/(authenticated)/requests'
    | '/(authorization)'
    | '/(authorization)/_auth'
    | '/(public)/users'
    | '/(public)/'
    | '/(authorization)/_auth/signin'
    | '/(authorization)/_auth/signup'
    | '/(public)/connections/$id'
    | '/(public)/profile/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authenticatedRequestsRoute: typeof authenticatedRequestsRoute
  authorizationRoute: typeof authorizationRouteWithChildren
  publicUsersRoute: typeof publicUsersRoute
  publicIndexRoute: typeof publicIndexRoute
  publicConnectionsIdRoute: typeof publicConnectionsIdRoute
  publicProfileIdRoute: typeof publicProfileIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  authenticatedRequestsRoute: authenticatedRequestsRoute,
  authorizationRoute: authorizationRouteWithChildren,
  publicUsersRoute: publicUsersRoute,
  publicIndexRoute: publicIndexRoute,
  publicConnectionsIdRoute: publicConnectionsIdRoute,
  publicProfileIdRoute: publicProfileIdRoute,
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
        "/(authenticated)/requests",
        "/(authorization)",
        "/(public)/users",
        "/(public)/",
        "/(public)/connections/$id",
        "/(public)/profile/$id"
      ]
    },
    "/(authenticated)/requests": {
      "filePath": "(authenticated)/requests.tsx"
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
    },
    "/(public)/connections/$id": {
      "filePath": "(public)/connections.$id.tsx"
    },
    "/(public)/profile/$id": {
      "filePath": "(public)/profile.$id.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
