import { inject, injectable } from "inversify";
import { ChatRepository } from "../../interfaces/chat-repository.interface";
import { CONFIG } from "../../ioc/config";
import { Chat } from "../../models/chat.model";
import { PrismaProvider } from "../../prisma/prisma";
import { Contact } from "../../schemas/chat.schema";
import { InternalErrorException } from "../../exceptions/internal-error.exception";

@injectable()
export class DbChatRepository implements ChatRepository {
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  public async save(chat: Chat): Promise<Chat> {
    const newChat = await this.prisma.prisma.chat.create({
      data: {
        from_id: chat.from_id,
        to_id: chat.to_id,
        message: chat.message,
        timestamp: new Date(),
      },
    });
    return newChat;
  }

  public async getConversation(
    userId1: number,
    userId2: number
  ): Promise<Chat[]> {
    const chats = await this.prisma.prisma.chat.findMany({
      where: {
        OR: [
          { AND: [{ from_id: userId1 }, { to_id: userId2 }] },
          { AND: [{ from_id: userId2 }, { to_id: userId1 }] },
        ],
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    return chats;
  }

  public async getRecentChats(
    userId: number,
    limit: number = 50
  ): Promise<Chat[]> {
    const chats = await this.prisma.prisma.chat.findMany({
      where: {
        OR: [{ from_id: userId }, { to_id: userId }],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });
    return chats;
  }

  public async getChats(userId: number) {
    const chats = await this.prisma.prisma.chat.findMany({
      where: {
        OR: [{ from_id: userId }, { to_id: userId }],
      },
    });
    return chats;
  }

  public async getChat(user_id: number, contact_id: number) {
    const chats = await this.prisma.prisma.chat.findMany({
      where: {
        OR: [
          { AND: [{ from_id: user_id }, { to_id: contact_id }] },
          { AND: [{ from_id: contact_id }, { to_id: user_id }] },
        ],
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    return chats;
  }

  public async getContactsByUserId(userId: number): Promise<Contact[]> {
    // First get connections with user details
    const contacts = await this.prisma.prisma.connection.findMany({
      where: {
        from_id: userId,
      },
      include: {
        users_connection_to_idTousers: {
          select: {
            id: true,
            full_name: true,
            profile_photo_path: true,
          },
        },
      },
    });

    const latestMessages = await this.prisma.prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [
              { from_id: userId },
              { to_id: { in: contacts.map((c) => c.to_id) } },
            ],
          },
          {
            AND: [
              { to_id: userId },
              { from_id: { in: contacts.map((c) => c.to_id) } },
            ],
          },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
      distinct: ["from_id", "to_id"],
    });

    const ret = contacts.map((contact) => {
      const lastMessage = latestMessages.find(
        (msg) =>
          (Number(msg.from_id) === userId && msg.to_id === contact.to_id) ||
          (Number(msg.to_id) === userId && msg.from_id === contact.to_id)
      );

      return {
        user_id: Number(contact.to_id),
        full_name: contact.users_connection_to_idTousers.full_name ?? "",
        profile_photo_path:
          contact.users_connection_to_idTousers.profile_photo_path,
        last_message: lastMessage?.message ?? null,
        last_message_time: lastMessage ? lastMessage.timestamp.getTime() : null,
      };
    });

    // sort it by last message time, if null it will be at the end
    // the latest message will be at the top
    ret.sort((a, b) => {
      if (a.last_message_time === null && b.last_message_time === null) {
        return 0;
      }

      if (a.last_message_time === null) {
        return 1;
      }

      if (b.last_message_time === null) {
        return -1;
      }

      return b.last_message_time - a.last_message_time;
    });

    return ret;
  }

  public async addMessage(message: Chat): Promise<Chat> {
    const newMessage = await this.prisma.prisma.chat.create({
      data: {
        from_id: message.from_id,
        to_id: message.to_id,
        message: message.message,
        timestamp: new Date(),
      },
    });
    return newMessage;
  }
}
