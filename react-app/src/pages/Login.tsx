import styled from "styled-components"
import PageWithHeader from "../components/PageWithHeader"
import { useState } from "react"
import { useLoginMutation } from "../api"

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const Form = styled.div`
  display: flex;
  flex: 1;
  max-width: 400px;
  flex-direction: column;
  gap: 16px;
`

const Input = styled.input`
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  color: #bdbdbd;
  background-color: #f6f6f6;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
`

const Button = styled.button`
  width: 100%;
  padding: 16px 32px;
  background-color: #5db075;
  border: none;
  border-radius: 100px;
  color: #fff;
  margin-top: 167px;
  cursor: pointer;
`

const ErrorText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #f44336;
  margin-top: 8px;
  text-align: center;
`

const Login: React.FC = () => {
  const [userName, setUserName] = useState("")
  const [roomId, setRoomId] = useState("")

  const [login, { isLoading, error }] = useLoginMutation()

  const handleLogin = async () => {
    try {
      const { data } = (await login({ userName, roomId })) as any

      if (data) {
        localStorage.setItem("userName", userName)
        localStorage.setItem("roomId", roomId)
        window.location.href = `/room/${roomId}`
      }
    } catch (error) {
      console.error("Error during login:", error)
    }
  }

  return (
    <PageWithHeader title="Join Chatroom">
      <Container>
        <Form>
          <Input
            type="text"
            placeholder="Username"
            autoFocus
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="RoomID"
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin()
              }
            }}
          />
          {error && <ErrorText>{error.data.error}</ErrorText>}
          <Button onClick={() => handleLogin()} disabled={!userName || !roomId}>
            JOIN
          </Button>
        </Form>
      </Container>
    </PageWithHeader>
  )
}

export default Login
