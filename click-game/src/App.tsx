import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import "./App.css";
import SocketProvider from "./hooks/useSocket";

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <RouterProvider router={routes} />
      </div>
    </SocketProvider>
  );
}

export default App;
