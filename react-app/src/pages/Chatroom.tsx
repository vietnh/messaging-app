import styled from "styled-components"
import PageWithHeader from "../components/PageWithHeader"
import { useGetMessagesQuery, useLogoutMutation } from "../api"
import { useParams } from "react-router-dom"
import { useState } from "react"
import send from "../Send.svg"
import { SocketEvent, getOrInitSocket } from "../core/socket"
import { useGetUserInfo } from "../core/hooks"
import { TextFieldWithIcon } from "../components/TextField"
import Message from "../components/Message"

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`

const ExitText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #5db075;
  cursor: pointer;
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 16px;
  padding-right: 16px;
  overflow-y: auto;
  height: calc(100vh - 190px);
`

const Chatroom: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const userInfo = useGetUserInfo()
  const [message, setMessage] = useState("")

  if (!id) {
    return null
  }

  const { data, isLoading } = useGetMessagesQuery(id)
  const [logout] = useLogoutMutation()

  const handleSubmit = () => {
    const socket = getOrInitSocket()
    socket.emit(SocketEvent.SEND_MESSAGE, { ...userInfo, message })
    setMessage("")
  }

  const handleLogout = async () => {
    if (!userInfo || !userInfo.userName || !userInfo.roomId) {
      return
    }

    const response = (await logout({
      userName: userInfo.userName,
      roomId: userInfo.roomId,
    })) as any

    if (response?.data) {
      localStorage.clear()
      window.location.href = "/login"
    }
  }

  return (
    <PageWithHeader
      title={id}
      leftContent={<ExitText onClick={() => handleLogout()}>Exit</ExitText>}
    >
      <Container>
        <MessageContainer>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            data?.map((message) => (
              <Message
                key={message._id}
                userName={message.userName}
                isOwner={message.userName === userInfo.userName}
                content={message.content}
              />
            ))
          )}
        </MessageContainer>
        <TextFieldWithIcon
          type="text"
          src={send}
          placeholder="Message here..."
          required
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          onClick={() => handleSubmit()}
        />
      </Container>
    </PageWithHeader>
  )
}

export default Chatroom
