import { io, Socket } from "socket.io-client"
import { useGetUserInfo } from "./hooks"

let socket: Socket

export enum SocketEvent {
  SEND_MESSAGE = "send_message",
  RECEIVE_MESSAGE = "receive_message",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
}

export function getOrInitSocket() {
  if (!socket) {
    const { userName, roomId } = useGetUserInfo()

    socket = io(`ws://${import.meta.env.VITE_API_HOST}`, {
      query: { userName, roomId },
    })
  }
  return socket
}
