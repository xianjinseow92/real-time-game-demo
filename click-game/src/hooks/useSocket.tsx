import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { socketURL } from "../constants/constants";

interface ISocket {
  socket: Socket | null;
}

const SocketContext = createContext<ISocket>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: any }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(socketURL, { autoConnect: false });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
