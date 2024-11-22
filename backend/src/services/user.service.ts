import { injectable, inject } from "inversify";
import { EmailService } from "./email.service";

@injectable()
export class UserService {
  constructor(@inject(EmailService) private emailService: EmailService) {}

  createUser(email: string) {
    this.emailService.sendEmail(email, "Welcome!");
    return { email };
  }
}
