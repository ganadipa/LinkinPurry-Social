import { inject, injectable } from "inversify";
import { UserRepository } from "../../interfaces/user-repository.interface";
import { PrismaClient } from "@prisma/client";
import { CONFIG } from "../../ioc/config";
import { User } from "../../models/user.model";
import { PrismaProvider } from "../../prisma/prisma";

@injectable()
export class DbUserRepository implements UserRepository {
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  public async findById(id: number) {
    const user = await this.prisma.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    return user;
  }

  public async save(user: User): Promise<User> {
    if (user.id) {
      return this.update(user);
    }
    return this.create(user);
  }

  public async create(user: User): Promise<User> {
    const newUser = await this.prisma.prisma.users.create({
      data: {
        email: user.email,
        full_name: user.full_name,
        password_hash: user.password_hash,
        username: user.username,
        profile_photo_path: user.profile_photo_path,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    return newUser;
  }

  public async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.prisma.users.update({
      where: {
        id: user.id,
      },
      data: user,
    });
    return updatedUser;
  }

  public async searchUsers(keyword: string): Promise<User[]> {
    console.log("user repo, searching for users with keyword: ", keyword); // debug
    const users = await this.prisma.prisma.users.findMany({
      where: keyword
        ? {
            username: {
              contains: keyword,
              mode: "insensitive",
            },
          }
        : {},
    });
    return users;
  }  
}
