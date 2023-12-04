import styled from "styled-components"

const Header = styled.header`
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
`
const Layout: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <>
      <Header>{title}</Header>
      {children}
    </>
  )
}

export default Layout
