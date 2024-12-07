import { z } from "zod";

export const ContactSchema = z.object({
  user_id: z.number(),
  full_name: z.string(),
  profile_photo_path: z.string(),
  last_message: z.string().nullable(),
  last_message_time: z.number().nullable(),
});
export const ContactsResponseBodySchema = z.array(ContactSchema);
export const ContactsResponseSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: ContactsResponseBodySchema.nullable(),
});

export type Contact = z.infer<typeof ContactSchema>;

export const MessageSchema = z.object({
  id: z.number(),
  content: z.string(),
  sender: z.number(),
  timestamp: z.number(),
});

export type Message = z.infer<typeof MessageSchema>;

export const GetChatToAContactParamSchema = z.object({
  contactId: z.string(),
});

export const MessagesSuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.array(MessageSchema),
});

export const MessageSocketSchema = z.object({
  content: z.string(),
  sender: z.number(),
  roomName: z.string(),
});
