import { injectable, inject } from "inversify";
import { LoginPayload, RegisterPayload } from "../../constants/request-payload";
import { CONFIG } from "../../ioc/config";
import { UserRepository } from "../../interfaces/user-repository.interface";
import bcrypt from "bcrypt";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { IAuthStrategy } from "../../interfaces/auth-strategy.interface";
import { User } from "../../models/user.model";
import { InternalErrorException } from "../../exceptions/internal-error.exception";

@injectable()
export class AuthService {
  constructor(
    @inject(CONFIG.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(CONFIG.AuthStrategy) private readonly authStrategy: IAuthStrategy
  ) {}

  public async login({ identifier, password }: LoginPayload) {
    let user = null;
    if (identifier.includes("@")) {
      user = await this.userRepository.findByEmail(identifier);
    } else {
      user = await this.userRepository.findByUsername(identifier);
    }

    if (!user) {
      throw new BadRequestException("Identifier or password is incorrect");
    }

    if (!user.id) {
      throw new InternalErrorException(
        "User from the repo somehow does not have an ID"
      );
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      throw new BadRequestException("Identifier or password is incorrect");
    }

    // Generate
    const token = await this.authStrategy.getToken(
      user.id.toString(),
      user.email
    );

    return token;
  }

  public async register({ email, name, password, username }: RegisterPayload) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Email is already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      console.log(existingUsername);
      throw new BadRequestException("Username is already in use");
      console.log("why am i even here");
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const userModel = new User(username, email, password_hash, name);
    const user = await this.userRepository.save(userModel);

    if (!user.id) {
      throw new InternalErrorException("User was not saved correctly");
    }

    const token = await this.authStrategy.getToken(
      user.id.toString(),
      user.email
    );

    return token;
  }
}
