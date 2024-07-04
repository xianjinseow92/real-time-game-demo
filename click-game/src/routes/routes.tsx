import { createBrowserRouter } from "react-router-dom";
import JoinGame from "../pages/JoinGame/JoinGame";
import ClickGame from "../pages/ClickGame/ClickGame";
export const ROUTE_NAMES = {
  BASE: "/",
  CLICK_GAME: "/click-game",
};

const routes = createBrowserRouter([
  { path: ROUTE_NAMES.BASE, element: <JoinGame /> },
  { path: ROUTE_NAMES.CLICK_GAME, element: <ClickGame /> },
]);

export default routes;
