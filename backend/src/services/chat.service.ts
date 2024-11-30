import { inject, injectable } from "inversify";
import { ChatRepository } from "../interfaces/chat-repository.interface";
import { CONFIG } from "../ioc/config";
import { Contact, Message } from "../schemas/chat.schema";

@injectable()
export class ChatService {
  constructor(
    @inject(CONFIG.ChatRepository) private chatRepository: ChatRepository
  ) {}

  public async getContactsByUserId(userId: number): Promise<Contact[]> {
    return this.chatRepository.getContactsByUserId(userId);
  }
}
