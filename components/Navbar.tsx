// components/Navbar.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  roomId: string;
  username: string;
  onLeaveRoom: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ roomId, username, onLeaveRoom }) => {
  return (
    <div className="h-[8vh] bg-slate-800 text-white text-lg flex justify-between items-center px-10  sticky top-0 w-full">
      <div className="flex lg:flex-row flex-col">
        <p>Room ID : </p>
        <p className="px-2">{roomId}</p>
      </div>
      <p>{username}</p>
      <Button onClick={onLeaveRoom}>Leave Room</Button>
    </div>
  );
};

export default Navbar;
