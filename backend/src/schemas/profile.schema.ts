import { z } from "zod";

export const GetProfileURLParamSchema = z.object({
  user_id: z.string(),
});

export const UpdateProfileURLParamSchema = GetProfileURLParamSchema;
