import { inject, injectable } from "inversify";
import { User } from "../models/user.model";
import { CONFIG } from "../ioc/config";
import { UserRepository } from "../interfaces/user-repository.interface";
import { BadRequestException } from "../exceptions/bad-request.exception";
import {
  TGetProfileBodyResponseByAuthenticated,
  TGetProfileBodyResponseByPublic,
} from "../constants/response-body";
import { ConnectionRepository } from "../interfaces/connection-repository.interface";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { FeedRepository } from "../interfaces/feed-repository.interface";
import { ForbiddenException } from "../exceptions/forbidden.exception";
import { URL_PUBLIC_UPLOADS } from "../constants/constants";

@injectable()
export class ProfileService {
  constructor(
    @inject(CONFIG.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(CONFIG.ConnectionRepository)
    private readonly connectionRepository: ConnectionRepository,
    @inject(CONFIG.FeedRepository)
    private readonly feedRepository: FeedRepository
  ) {}

  public async getProfile(
    userId: number,
    currentUser: User | null
  ): Promise<
    TGetProfileBodyResponseByPublic | TGetProfileBodyResponseByAuthenticated
  > {
    if (!currentUser) {
      return this.getProfileDataFromGuest(userId);
    }

    if (!currentUser.id) {
      throw new InternalErrorException(
        "Current user somehow does not have an id?"
      );
    }

    const ret = await this.getProfileDataFromAuthenticated(userId);
    return ret;
  }

  public async updateProfile(
    userId: number,
    updateData: User
  ): Promise<TGetProfileBodyResponseByAuthenticated> {
    if (!updateData.id) {
      throw new InternalErrorException(
        "User ID somehow missing from the context!"
      );
    }

    if (Number(updateData.id) !== userId) {
      throw new ForbiddenException("Cannot update another user's profile");
    }

    await this.userRepository.save(updateData);
    return this.getProfileDataFromAuthenticated(userId);
  }

  private async getProfileDataFromGuest(
    userId: number
  ): Promise<TGetProfileBodyResponseByPublic> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const countConnections = await this.connectionRepository.countConnections(
      BigInt(userId)
    );

    return {
      username: user.username,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      connection_count: countConnections,
      profile_photo: URL_PUBLIC_UPLOADS + user.profile_photo_path,
    };
  }

  private async getProfileDataFromAuthenticated(
    userId: number
  ): Promise<TGetProfileBodyResponseByAuthenticated> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const countConnections = await this.connectionRepository.countConnections(
      BigInt(userId)
    );

    const posts = await this.feedRepository.findByUserId(BigInt(userId));

    const posts_number_timestamp = posts.map((post) => {
      if (!post.created_at) {
        throw new InternalErrorException("Post created_at somehow missing");
      }

      if (!post.updated_at) {
        throw new InternalErrorException("Post updated_at somehow missing");
      }

      if (!post.id) {
        throw new InternalErrorException("Post ID somehow missing");
      }

      return {
        content: post.content,
        created_at: post.created_at.getTime(),
        updated_at: post.updated_at.getTime(),
        id: Number(post.id),
      };
    });

    return {
      username: user.username,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      connection_count: countConnections,
      profile_photo: URL_PUBLIC_UPLOADS + user.profile_photo_path,
      relevant_posts: posts_number_timestamp,
    };
  }
}
