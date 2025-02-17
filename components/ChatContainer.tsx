// components/ChatContainer.tsx
import React, { useEffect, useRef } from "react";
import { useRoomContext } from "@/context/RoomContext";
import Image from "next/image";

interface Chat {
  id: number;
  sender: string;
  content: string;
  time: string;
}

interface ChatContainerProps {
  chats: Chat[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chats }) => {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useRoomContext();
  function calculateMinutesAgo(timeString: string) {
    const [hours, minutes] = timeString.split(":").map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12; // Convert 0 -> 12 for midnight

    // Format time with AM/PM
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;

    return formattedTime;
  }
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats]);
  return (
    <div
      className="overflow-y-auto flex-1 lg:mx-[20vw] px-4 py-20 space-y-10 scrollbar-hide max-h-[80vh] "
      ref={chatBoxRef}
    >
      {chats.map((chat, index) => (
        <div
          className={`flex ${
            chat.sender === currentUser ? "justify-end " : "justify-start "
          }  gap-2.5 `}
          key={index}
        >
          <Image
            className="w-8 h-8 rounded-full"
            src={`https://avatar.iran.liara.run/public/boy?username=${chat.sender}`}
            alt="Jese image"
            width={40}
            height={40}
          />
          <div
            className={`flex flex-col  max-w-[320px] leading-1.5 p-4 border-gray-200 ${
              currentUser === chat.sender ? "bg-[#155E95] " : "bg-[#3D8D7A] "
            } text-white rounded-e-xl rounded-es-xl dark:bg-gray-700 lg:w-full w-[50%]`}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold  dark:text-white">
                {chat.sender}
              </span>
            </div>
            <p className="text-sm font-normal py-2.5  dark:text-white">
              {chat.content}
            </p>
            <span className="text-sm font-normal text-gray-700 dark:text-gray-400">
              {calculateMinutesAgo(chat.time)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
