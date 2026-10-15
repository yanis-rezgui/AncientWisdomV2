import { Server } from "socket.io";
import socketAuth from "./socketAuth.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        // Ajoute ici l'URL de production d'Ancient Wisdom.
      ],
      credentials: true,
    },
  });

  // Authentification JWT pour tous les sockets
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    // Room personnelle : notifications destinées à cet utilisateur
    socket.join(`user:${userId}`);

    if (user.role === "ADMIN") {
      // Room commune aux administrateurs
      socket.join("admins");

      console.log(
        `Admin ${userId} connected and joined admins room`
      );
    } else {
      console.log(`User ${userId} connected`);
    }

    socket.on("disconnect", (reason) => {
      console.log(`User ${userId} disconnected: ${reason}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
};