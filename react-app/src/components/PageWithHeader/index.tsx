import styled from "styled-components"

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
`
const Layout: React.FC<
  React.PropsWithChildren<{
    title: string
    leftContent?: React.ReactNode
    rightContent?: React.ReactNode
  }>
> = ({ title, children, leftContent, rightContent }) => {
  return (
    <>
      <Header>
        <div>{leftContent}</div>
        <div>{title}</div>
        <div>{rightContent}</div>
      </Header>
      {children}
    </>
  )
}

export default Layout
