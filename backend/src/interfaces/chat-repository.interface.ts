import { Contact } from "../schemas/chat.schema";
import { Chat } from "../models/chat.model";

export interface ChatRepository {
  save(chat: Chat): Promise<Chat>;
  getConversation(userId1: number, userId2: number): Promise<Chat[]>;
  getRecentChats(userId: number, limit?: number): Promise<Chat[]>;
  getChat(user_id: number, contact_id: number): Promise<Chat[]>;
  getChats(userId: number): Promise<Chat[]>;
  getContactsByUserId(userId: number): Promise<Contact[]>;
  addMessage(message: Chat): Promise<Chat>;
}
