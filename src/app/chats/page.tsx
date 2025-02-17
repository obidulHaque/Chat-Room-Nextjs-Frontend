"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import ChatContainer from "../../../components/ChatContainer";
import SearchContainer from "../../../components/SearchContainer";
import { useRoomContext } from "@/context/RoomContext";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Stomp, Client } from "@stomp/stompjs";
import { Api, BaseUrl } from "@/Config/ApiConfig";
import toast from "react-hot-toast";

interface Chat {
  sender: string;
  content: string;
  time?: string;
}

export default function Chats() {
  const [inputValue, setInputValue] = useState<string>("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const {
    roomId,
    currentUser,
    isConnected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useRoomContext();
  const router = useRouter();
  useEffect(() => {
    if (roomId === "" || currentUser === "") {
      router.push("/");
    }
  }, [roomId, currentUser, isConnected, router]);
  useEffect(() => {
    const getMessages = async () => {
      const response = await Api.get(`chatRoom/${roomId}/messages`);
      setChats(response.data);
    };
    getMessages();
  }, []);
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS(`${BaseUrl}/chat`);
      const client = Stomp.over(socket) as Client; // Ensure correct type

      client.onConnect = () => {
        setStompClient(client); // Ensure this is set only after a successful connection
        console.log("Connected to server:", client);
        toast.success("Connected successfully");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setChats((prev) => [...prev, newMessage]);
        });
      };

      client.onStompError = (frame) => {
        console.error("STOMP Error:", frame);
        toast.error("STOMP connection error.");
      };

      client.activate(); // Instead of connect(), use activate() for the latest Stomp versions
    };

    if (isConnected) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate(); // Clean up WebSocket connection
      }
    };
  }, [isConnected, roomId]);

  const sendMessage = async () => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP client is not connected.");
      toast.error("WebSocket is not connected!");
      return;
    }

    if (!inputValue.trim()) return;

    const message = {
      sender: currentUser,
      content: inputValue,
    };

    try {
      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.log(error);
    }

    console.log("Message sent:", message);
    setInputValue("");
  };

  const handleLeaveRoom = () => {
    if (stompClient && stompClient.connected) {
      stompClient
        .deactivate()
        .then(() => {
          toast.success("Disconnected from chat room");
        })
        .catch((error) => {
          console.error("Error disconnecting:", error);
          toast.error("Failed to disconnect");
        });
    }
    setConnected(false);

    setRoomId("");
    setCurrentUser("");
    router.push("/");
  };

  return (
    <div className="w-full h-screen bg-black overflow-y-auto relative">
      <Navbar
        roomId={roomId}
        username={currentUser}
        onLeaveRoom={handleLeaveRoom}
      />
      <ChatContainer chats={chats} />
      <SearchContainer
        setInputValue={setInputValue}
        submit={sendMessage}
        input={inputValue}
      />
    </div>
  );
}
