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
    console.log("going to the db!");
    if (identifier.includes("@")) {
      user = await this.userRepository.findByEmail(identifier.toLowerCase());
    } else {
      user = await this.userRepository.findByUsername(identifier);
    }
    console.log("got user from db!");
    console.log(user);

    if (!user) {
      throw new BadRequestException("Identifier or password is incorrect");
    }

    console.log("going to check if user has an ID!");

    if (!user.id) {
      throw new InternalErrorException(
        "User from the repo somehow does not have an ID"
      );
    }

    console.log("going to compare password!");
    console.log(password);
    console.log(user.password_hash);
    const match = await bcrypt.compare(password, user.password_hash);
    console.log("password compared!");
    if (!match) {
      throw new BadRequestException("Identifier or password is incorrect");
    }

    // Generate
    console.log("going to generate token!");
    const token = await this.authStrategy.getToken(
      user.id.toString(),
      user.email
    );

    console.log("token generated!");
    return token;
  }

  public async register({ email, name, password, username }: RegisterPayload) {
    email = email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Email is already in use");
    }

    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new BadRequestException("Username is already in use");
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
