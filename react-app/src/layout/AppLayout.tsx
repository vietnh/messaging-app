import styled from "styled-components"
import { Outlet } from "react-router-dom"

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
`
const Layout: React.FC = () => {
  return (
    <Root>
      <Outlet />
    </Root>
  )
}

export default Layout