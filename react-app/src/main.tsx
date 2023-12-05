import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./core/store"
import "@fontsource/inter"
import "./index.css"
import Login from "./pages/Login"
import Layout from "./layout/AppLayout"
import Chatroom from "./pages/Chatroom"
import App from "./App"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/room/:id",
        element: <Chatroom />,
      },
    ],
  },
])


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
