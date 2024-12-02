import { inject, injectable } from "inversify";
import { ChatRepository } from "../interfaces/chat-repository.interface";
import { CONFIG } from "../ioc/config";
import { Contact, Message } from "../schemas/chat.schema";
import { InternalErrorException } from "../exceptions/internal-error.exception";

@injectable()
export class ChatService {
  constructor(
    @inject(CONFIG.ChatRepository) private chatRepository: ChatRepository
  ) {}

  public async getContactsByUserId(userId: number): Promise<Contact[]> {
    return this.chatRepository.getContactsByUserId(userId);
  }

  public async getChatToAContact(
    userId: number,
    contactId: number
  ): Promise<Message[]> {
    const chat = await this.chatRepository.getChat(userId, contactId);

    return chat.map((c) => {
      if (!c.id) {
        throw new InternalErrorException("Chat id is missing");
      }

      if (!c.timestamp) {
        throw new InternalErrorException("Chat timestamp is missing");
      }

      return {
        id: Number(c.id),
        timestamp: c.timestamp.getTime(),
        sender: Number(c.from_id),
        content: c.message,
      };
    });
  }
}
