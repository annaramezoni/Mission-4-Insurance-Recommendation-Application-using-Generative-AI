import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Chat from "./components/Chat.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/chat",
        Component: Chat,
      },
    ],
  },
]);

export default router;
