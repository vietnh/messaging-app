import { io, Socket } from "socket.io-client"

let socket: Socket;

export enum SocketEvent {
  SEND_MESSAGE = "send_message",
  RECEIVE_MESSAGE = "receive_message",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
}

export function getSocket() {
  if (!socket) {
    socket = io(`ws://${import.meta.env.API_HOST}`);
  }
  return socket;
}