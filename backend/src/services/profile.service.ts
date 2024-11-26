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

  public async getProfile(userId: number, currentUser: User | null) {
    if (!currentUser) {
      return this.getProfileDataFromGuest(userId);
    }

    if (!currentUser.id) {
      throw new InternalErrorException(
        "Current user somehow does not have an id?"
      );
    }

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
      profile_photo: user.profile_photo_path,
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

    return {
      username: user.username,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      connection_count: countConnections,
      profile_photo: user.profile_photo_path,
      relevant_posts: [],
    };
  }
}
