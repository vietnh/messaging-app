import styled from "styled-components"

const Icon = styled.img`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`

const Input = styled.input`
  width: calc(100% - 46px);
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  color: #bdbdbd;
  background-color: #f6f6f6;
  border: 1px solid #e8e8e8;
  border-radius: 100px;
`

const InputContainer = styled.div`
  position: relative;
  display: inline-block;
`

const TextFieldWithIcon: React.FC<any> = ({ src, onClick, ...rest }) => {
  return (
    <InputContainer>
      <Input {...rest} />
      <Icon src={src} alt="" onClick={onClick} />
    </InputContainer>
  )
}

export default TextFieldWithIcon
