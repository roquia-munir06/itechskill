import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace("/api", "") 
                   || "http://localhost:5000";

// Created ONCE, shared across whole app
const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ["websocket"],
});

export default socket;