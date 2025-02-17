"use client";
import { useState, createContext, useContext, ReactNode } from "react";

type RoomContextType = {
  roomId: string;
  setRoomId: (value: string) => void;
  currentUser: string;
  setCurrentUser: (value: string) => void;
  isConnected: boolean;
  setConnected: (value: boolean) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isConnected, setConnected] = useState(false);
  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        currentUser,
        setCurrentUser,
        isConnected,
        setConnected,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};
