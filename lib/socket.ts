import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket: Socket | null = null;

export const getChatSocket = () => socket;

export const connectChatSocket = () => {
  const token = useAuthStore.getState().token;

  if (socket) {
    if (!socket.connected) {
      socket.auth = token ? { token } : {};
      socket.connect();
    }
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    auth: token ? { token } : {},
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
