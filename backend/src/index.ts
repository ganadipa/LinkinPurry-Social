import { Application } from "./core/app";
import dotenv from "dotenv";

// dotenv.config({
//   path: ".env.prod",
// });
const app = new Application();
const port = Number(process.env.PORT) || 8000;
app.start(port);

export default app.getApp();
