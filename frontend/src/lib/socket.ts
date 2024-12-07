// import { io } from "socket.io-client";
// import { Socket } from "socket.io-client";

// export class SocketIO {
//   private static instance: SocketIO;
//   io: Socket;

//   private constructor() {
//     this.io = io("http://localhost:8000", {
//       path: "/ws",
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });
//   }

//   public static getInstance() {
//     if (!this.instance) {
//       this.instance = new SocketIO();
//     }

//     return this.instance;
//   }
// }
