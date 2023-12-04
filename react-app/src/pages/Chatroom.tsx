import styled from "styled-components"
import PageWithHeader from "../components/PageWithHeader"
import { useGetMessagesQuery } from "../api/message"
import { useParams } from "react-router-dom"
import { useState } from "react"
import send from "../Send.svg"
import { SocketEvent, getOrInitSocket } from "../core/socket"
import { useGetUserInfo } from "../core/hooks"

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`

const InputContainer = styled.div`
  position: relative;
  display: inline-block;
`

const SendIcon = styled.img`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`

const Input = styled.input`
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  color: #bdbdbd;
  background-color: #f6f6f6;
  border: 1px solid #e8e8e8;
  border-radius: 100px;
  padding-right: 50px;
`

const Chatroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userInfo = useGetUserInfo();
  const [message, setMessage] = useState("")

  if (!id) {
    return null;
  }

  const { data, error, isLoading } = useGetMessagesQuery(id)

  const handleSubmit = () => {
    const socket = getOrInitSocket()
    socket.emit(SocketEvent.SEND_MESSAGE, { ...userInfo, message })
  }

  return (
    <PageWithHeader title={id}>
      <Container>
        <div>test</div>
        <InputContainer>
          <Input
            type="text"
            placeholder="Message here..."
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendIcon src={send} alt="send" onClick={() => handleSubmit()} />
        </InputContainer>
      </Container>
    </PageWithHeader>
  )
}

export default Chatroom
