import { Application } from "./core/app";

const app = new Application();
const port = Number(process.env.PORT) || 3000;
app.start(port);

export default app.getApp();
