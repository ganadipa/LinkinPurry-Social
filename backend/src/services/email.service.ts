import { injectable } from "inversify";

@injectable()
export class EmailService {
  sendEmail(to: string, message: string) {
    console.log(`Sending email to ${to}: ${message}`);
  }
}
