import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useGetUserInfo = () => {
  const userName = localStorage.getItem("userName")
  const roomId = localStorage.getItem("roomId")
  if (!userName || !roomId) {
    window.location.href = "/login"
  }
  return { userName, roomId }
}
