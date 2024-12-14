import { inject, injectable } from "inversify";
import { CONFIG } from "../ioc/config";
import { UserRepository } from "../interfaces/user-repository.interface";
import { User } from "../models/user.model";

@injectable()
export class UserService {
    constructor(
        @inject(CONFIG.UserRepository) private userRepository: UserRepository
    ) {}

    public async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findById(id);
    }
}
