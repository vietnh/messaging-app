import styled from "styled-components"

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const MessageSender = styled.div<{ isOwner: boolean }>`
  display: flex;
  align-self: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
`

const Content = styled.div<{ isOwner: boolean }>`
  align-self: ${(props) => (props.isOwner ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isOwner ? "#5db075" : "#f6f6f6")};
  padding: 16px;
  border-radius: 8px;
  border-bottom-left-radius: ${(props) => (props.isOwner ? "8px" : "0")};
  border-bottom-right-radius: ${(props) => (props.isOwner ? "0" : "8px")};
  color: ${(props) => (props.isOwner ? "#fff" : "#000")};
  font-size: 14px;
  font-weight: 400;
  max-width: 80%;
  word-break: break-word;
`

const Arrow = styled.div<{ isOwner: boolean }>`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${(props) =>
    props.isOwner ? "0 16px 16px 0" : "0 16px 16px 16px"};
  border-color: ${(props) =>
    props.isOwner
      ? "transparent #5DB075 transparent"
      : "transparent transparent transparent #F6F6F6"};
  align-self: ${(props) => (props.isOwner ? "flex-end" : "flex-start")};
`

interface MessageProps {
  userName: string
  isOwner: boolean
  content: string
}

const Message: React.FC<MessageProps> = ({ userName, isOwner, content }) => {
  return (
    <MessageWrapper>
      {!isOwner && <MessageSender isOwner={isOwner}>{userName}</MessageSender>}
      <Content isOwner={isOwner}>{content}</Content>
      <Arrow isOwner={isOwner} />
    </MessageWrapper>
  )
}

export default Message;