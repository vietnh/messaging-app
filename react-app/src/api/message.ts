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

export const messageApi = createApi({
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

          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // if it is a message for the appropriate channel,
          // update our query result with the received message
          const listener = (message) => {
            if (message.roomId !== arg) return

            updateCachedData((draft) => {
              draft.push(message)
            })
            alert(message)
          }

          socket.on(SocketEvent.RECEIVE_MESSAGE, listener)
        } catch (e) {}
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        socket.off(SocketEvent.RECEIVE_MESSAGE)
        socket.close()
      },
    }),
  }),
})

export const { useLoginMutation, useGetMessagesQuery } = messageApi
