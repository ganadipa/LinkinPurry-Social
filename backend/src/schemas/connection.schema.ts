import { z } from "zod";

// schema for /api/users
export const GetUsersResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      email: z.string().optional(),
      name: z.string().optional(),
      profile_photo_path: z.string().optional(),
    })
  ),
});

// schema for /api/connections
export const GetConnectionsResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.array(
    z.object({
      from_id: z.number(),
      to_id: z.number(),
    })
  ),
});

// schema for /api/connections/request
export const RequestConnectionSchema = z.object({
  to_id: z.number(),
});

// schema for /api/connections/requests/{from_id}
export const RespondToConnectionRequestSchema = z.object({
  action: z.enum(["accept", "reject"]),
});

// schema for /api/connections/requests
export const GetConnectionRequestsResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.array(
    z.object({
      from_id: z.number(),
      to_id: z.number(),
    })
  ),
});

// schema for /api/connections/{user_id}
export const UnconnectSchema = z.object({
  user_id: z.number(),
});

// schema for /api/connection/check
export const CheckConnectionRequestSchema = z.object({
  from_id: z.number(),
  to_id: z.number(),
});

export const CheckConnectionResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.object({
    connected: z.boolean(),
  }),
});

// schema for /api/connections/requests-from
export const GetConnectionRequestsFromResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.array(
    z.object({
      from_id: z.number(),
      to_id: z.number(),
    })
  ),
});
