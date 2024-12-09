import { Application } from "./core/app";
import { Message, MessageSocketSchema } from "./schemas/chat.schema";
import dotenv from "dotenv";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

dotenv.config({
  path: ".env.example",
});

const app = new Application();
const port = Number(process.env.PORT) || 8000;
app.start(port);

export default app.getApp();
