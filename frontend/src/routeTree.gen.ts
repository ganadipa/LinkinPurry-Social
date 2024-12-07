/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedRequestsImport } from './routes/_authenticated/requests'
import { Route as AuthenticatedChatImport } from './routes/_authenticated/chat'
import { Route as publicUsersImport } from './routes/(public)/users'
import { Route as authorizationAuthImport } from './routes/(authorization)/_auth'
import { Route as AuthenticatedChatIndexImport } from './routes/_authenticated/chat/index'
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

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedRequestsRoute = AuthenticatedRequestsImport.update({
  id: '/requests',
  path: '/requests',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedChatRoute = AuthenticatedChatImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => AuthenticatedRoute,
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

const AuthenticatedChatIndexRoute = AuthenticatedChatIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedChatRoute,
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
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
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
    '/_authenticated/chat': {
      id: '/_authenticated/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof AuthenticatedChatImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/requests': {
      id: '/_authenticated/requests'
      path: '/requests'
      fullPath: '/requests'
      preLoaderRoute: typeof AuthenticatedRequestsImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
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
    '/_authenticated/chat/': {
      id: '/_authenticated/chat/'
      path: '/'
      fullPath: '/chat/'
      preLoaderRoute: typeof AuthenticatedChatIndexImport
      parentRoute: typeof AuthenticatedChatImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedChatRouteChildren {
  AuthenticatedChatIndexRoute: typeof AuthenticatedChatIndexRoute
}

const AuthenticatedChatRouteChildren: AuthenticatedChatRouteChildren = {
  AuthenticatedChatIndexRoute: AuthenticatedChatIndexRoute,
}

const AuthenticatedChatRouteWithChildren =
  AuthenticatedChatRoute._addFileChildren(AuthenticatedChatRouteChildren)

interface AuthenticatedRouteChildren {
  AuthenticatedChatRoute: typeof AuthenticatedChatRouteWithChildren
  AuthenticatedRequestsRoute: typeof AuthenticatedRequestsRoute
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedChatRoute: AuthenticatedChatRouteWithChildren,
  AuthenticatedRequestsRoute: AuthenticatedRequestsRoute,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

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
  '': typeof AuthenticatedRouteWithChildren
  '/': typeof AuthenticatedIndexRoute
  '/users': typeof publicUsersRoute
  '/chat': typeof AuthenticatedChatRouteWithChildren
  '/requests': typeof AuthenticatedRequestsRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
  '/connections/$id': typeof publicConnectionsIdRoute
  '/profile/$id': typeof publicProfileIdRoute
  '/chat/': typeof AuthenticatedChatIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof AuthenticatedIndexRoute
  '/users': typeof publicUsersRoute
  '/requests': typeof AuthenticatedRequestsRoute
  '/signin': typeof authorizationAuthSigninRoute
  '/signup': typeof authorizationAuthSignupRoute
  '/connections/$id': typeof publicConnectionsIdRoute
  '/profile/$id': typeof publicProfileIdRoute
  '/chat': typeof AuthenticatedChatIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/(authorization)': typeof authorizationRouteWithChildren
  '/(authorization)/_auth': typeof authorizationAuthRouteWithChildren
  '/(public)/users': typeof publicUsersRoute
  '/_authenticated/chat': typeof AuthenticatedChatRouteWithChildren
  '/_authenticated/requests': typeof AuthenticatedRequestsRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/(authorization)/_auth/signin': typeof authorizationAuthSigninRoute
  '/(authorization)/_auth/signup': typeof authorizationAuthSignupRoute
  '/(public)/connections/$id': typeof publicConnectionsIdRoute
  '/(public)/profile/$id': typeof publicProfileIdRoute
  '/_authenticated/chat/': typeof AuthenticatedChatIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/users'
    | '/chat'
    | '/requests'
    | '/signin'
    | '/signup'
    | '/connections/$id'
    | '/profile/$id'
    | '/chat/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/users'
    | '/requests'
    | '/signin'
    | '/signup'
    | '/connections/$id'
    | '/profile/$id'
    | '/chat'
  id:
    | '__root__'
    | '/_authenticated'
    | '/(authorization)'
    | '/(authorization)/_auth'
    | '/(public)/users'
    | '/_authenticated/chat'
    | '/_authenticated/requests'
    | '/_authenticated/'
    | '/(authorization)/_auth/signin'
    | '/(authorization)/_auth/signup'
    | '/(public)/connections/$id'
    | '/(public)/profile/$id'
    | '/_authenticated/chat/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  authorizationRoute: typeof authorizationRouteWithChildren
  publicUsersRoute: typeof publicUsersRoute
  publicConnectionsIdRoute: typeof publicConnectionsIdRoute
  publicProfileIdRoute: typeof publicProfileIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  authorizationRoute: authorizationRouteWithChildren,
  publicUsersRoute: publicUsersRoute,
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
        "/_authenticated",
        "/(authorization)",
        "/(public)/users",
        "/(public)/connections/$id",
        "/(public)/profile/$id"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/chat",
        "/_authenticated/requests",
        "/_authenticated/"
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
    "/(public)/users": {
      "filePath": "(public)/users.tsx"
    },
    "/_authenticated/chat": {
      "filePath": "_authenticated/chat.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/chat/"
      ]
    },
    "/_authenticated/requests": {
      "filePath": "_authenticated/requests.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
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
    },
    "/_authenticated/chat/": {
      "filePath": "_authenticated/chat/index.tsx",
      "parent": "/_authenticated/chat"
    }
  }
}
ROUTE_MANIFEST_END */
