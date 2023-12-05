import styled from "styled-components"
import { Outlet } from "react-router-dom"

const Root = styled.div`
  height: 100%;
  padding: 16px 0 16px 16px;
`
const Layout: React.FC = () => {
  return (
    <Root>
      <Outlet />
    </Root>
  )
}

export default Layout
