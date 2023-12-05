import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { SocketEvent, getOrInitSocket } from "../core/socket"

export interface Message {
  roomId: string
  userName: string
  content: string
}

export interface LoginCredentials {
  userName: string
  roomId: string
}

export interface LoginResponse {
  userName: string
  activeRoomId: string
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${import.meta.env.VITE_API_HOST}`,
  }),
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "api/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: build.mutation<boolean, LoginCredentials>({
      query: (credentials) => ({
        url: "api/logout",
        method: "POST",
        body: credentials,
      }),
    }),

    getMessages: build.query<Message[], string>({
      query: (roomId) => `api/messages/${roomId}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const socket = getOrInitSocket()

        try {
          socket.on("connect_error", (event) => {
            console.error("WebSocket error:", event)
          })

          await cacheDataLoaded

          const handleReceiveMessage = (message) => {
            if (message.roomId !== arg) return

            updateCachedData((draft) => {
              draft.unshift(message)
            })
          }

          socket.on(SocketEvent.RECEIVE_MESSAGE, handleReceiveMessage)
        } catch (e) {}
        await cacheEntryRemoved
        socket.off(SocketEvent.RECEIVE_MESSAGE)
        socket.close()
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useGetMessagesQuery } = api
