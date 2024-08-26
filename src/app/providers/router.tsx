import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AdminPage } from "../../pages/admin"
import { LoginPage } from "../../pages/login"

const router = createBrowserRouter([
  {
    path: "/:sessionId",
    element: <div>Hello session!</div>,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
])

export const Router = () => <RouterProvider router={router} />
