// src/router/index.js

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthLayouts from "../layout/index";

import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordpage";
import ForgotPassword from "../pages/ForgotPassword";
import AnonymousChatEntry from "../pages/AnonymousChatEntry";
import AnonymousChatRoom from "../pages/AnonymousChatRoom";
import MessagePage from "../components/MessagePage";
import VerifyEmailPage from "../pages/VerifyEmailPage"; // You should have this file

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register/registerUser/:id/verify/:token",
        element: (
          <AuthLayouts>
            <VerifyEmailPage />
          </AuthLayouts>
        ),
      },
      {
        path: "register",
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },

      {
        path: "email",
        element: (
          <AuthLayouts>
            <CheckEmailPage />
          </AuthLayouts>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayouts>
            <CheckPasswordPage />
          </AuthLayouts>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "anonymous",
        element: (
          <AuthLayouts>
            <AnonymousChatEntry />
          </AuthLayouts>
        ),
      },
      {
        path: "anon-chat/:sessionId",
        element: <AnonymousChatRoom />,
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
