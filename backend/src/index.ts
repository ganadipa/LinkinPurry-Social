import { Application } from "./core/app";

// dotenv.config({
//   path: ".env.prod",
// });
const app = new Application();
const port = Number(process.env.PORT) || 8000;
app.start(port);

const io = app.getSocket();
io.on("connection", (socket) => {
  socket.emit("hello", "Hello from the server!");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default app.getApp();
