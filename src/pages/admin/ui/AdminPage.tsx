import { BrowserRouter } from "react-router-dom"
import { Admin, CustomRoutes } from "react-admin"

import {
  customAuthProvider,
  LoginPage,
} from "../../login/ui/LoginPage"
import { firestoreDataProvider } from "../../login/ui/firebase"
import { filmResource } from "../../../widgets/film"
import { Route } from "react-router-dom"
import { VotePage } from "../../vote"
import { sessionResource } from "../../../widgets/session"

export const AdminPage = () => (
  <BrowserRouter>
    <Admin
      loginPage={LoginPage}
      authProvider={customAuthProvider}
      dataProvider={firestoreDataProvider}
    >
      {sessionResource}
      {filmResource}

      <CustomRoutes noLayout>
        <Route path="/vote/:sessionId" element={<VotePage />} />
      </CustomRoutes>
    </Admin>
  </BrowserRouter>
)
