import { useGetUserInfo } from "./core/hooks"

function App() {
  const userInfo = useGetUserInfo();

  if (!userInfo) {
    window.location.href = "/login"
  } else {
    window.location.href = `/room/${userInfo.roomId}`
  }

  return (
    <>Loading...</>
  )
}

export default App
