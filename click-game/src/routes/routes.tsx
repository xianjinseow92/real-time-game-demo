import { createBrowserRouter } from "react-router-dom";
import JoinGame from "../pages/JoinGame/JoinGame";
import ClickGame from "../pages/ClickGame/ClickGame";

const basename =
  process.env.NODE_ENV === "production" ? "/real-time-game-demo" : "";

export const ROUTE_NAMES = {
  BASE: basename + "/",
  CLICK_GAME: basename + "/click-game",
};

const routes = createBrowserRouter([
  { path: ROUTE_NAMES.BASE, element: <JoinGame /> },
  { path: ROUTE_NAMES.CLICK_GAME, element: <ClickGame /> },
]);

export default routes;
