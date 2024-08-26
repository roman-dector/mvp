import { FormEventHandler, useState } from "react"

import { AuthProvider, useLogin } from "react-admin"
import { signOut, signInWithEmailAndPassword } from "firebase/auth"
import { TextField, Button, Card, CardContent } from "@mui/material"

import { auth } from "./firebase"

type Creds = { email: string; password: string }

const login = ({ email, password }: Creds) =>
  signInWithEmailAndPassword(auth, email, password)

const logout = () => signOut(auth)

export const customAuthProvider: AuthProvider = {
  login, // called when the user attempts to log in
  logout, // called when the user clicks on the logout button

  // called when the API returns an error
  checkError: async ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      await logout()
      return Promise.reject()
    }
    return Promise.resolve()
  },

  // called when the user navigates to a new location, to check for authentication
  checkAuth: async () => {
    await auth.authStateReady()

    console.debug(auth.currentUser)

    return auth.currentUser ? Promise.resolve() : Promise.reject()
  },

  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: async () => "admin",
}

export function LoginPage() {
  const login = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const credentials = { email, password }

    login(credentials)
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "fit-content",
          height: "fit-content",
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
        }}
      >
        <h1>Авторизуйтесь</h1>

        <CardContent sx={{ width: "fit-content" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexFlow: "column",
              width: "400px",
              gap: "5px",
            }}
          >
            <TextField
              placeholder="почта"
              label="почта"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              placeholder="пароль"
              label="пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ height: "50px", marginTop: "10px" }}
            >
              {"Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
