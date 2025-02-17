"use client";

import { Api } from "@/Config/ApiConfig";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRoomContext } from "@/context/RoomContext";
import { useRouter } from "next/navigation";

// Schema validation for the form fields
const formSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name can't exceed 50 characters"),
  roomId: z.string().min(2, "Room ID must be at least 2 characters"),
});

export default function Page() {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);

  const { setRoomId, setCurrentUser, setConnected } = useRoomContext();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      roomId: "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isCreatingRoom) {
      await createRoom(values);
    } else {
      await joinRoom(values);
    }
  };

  // Function to handle room creation
  const createRoom = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await Api.post("/chatRoom", values.roomId, {
        headers: { "Content-Type": "text/plain" },
      });
      toast.success("Chat Room created successfully!");
      setRoomId(values.roomId);
      setCurrentUser(values.username);
      setConnected(true);
      router.replace("/chats");
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle room joining
  const joinRoom = async (values: z.infer<typeof formSchema>) => {
    try {
      setSecondLoading(true);
      await Api.get(`/chatRoom/${values.roomId}`);
      toast.success("Joined Chat Room successfully!");
      setRoomId(values.roomId);
      setCurrentUser(values.username);
      setConnected(true);
      router.replace("/chats");
    } catch (error: any) {
      handleError(error);
    } finally {
      setSecondLoading(false);
    }
  };

  // Function to handle error responses
  const handleError = (error: any) => {
    if (error.status === 400) {
      toast.error(`${error.response.data}`);
    } else {
      toast.error("An unknown error occurred");
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-950 flex justify-center items-center">
      <div className="bg-zinc-800 w-[90%] sm:w-[30vw] h-auto rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl text-center text-white font-semibold mb-6">
          {isCreatingRoom ? "Create Room" : "Join Room"}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your Full Name"
                      className="rounded-xl text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Room ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Room ID"
                      className="rounded-xl text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4">
              <Button
                type="submit"
                className="w-full bg-sky-400 hover:bg-sky-500"
                onClick={() => setIsCreatingRoom(false)}
              >
                {secondLoading ? "Please wait..." : "Join Room"}
              </Button>
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => setIsCreatingRoom(true)}
              >
                {loading ? "Please wait..." : "Create Room"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
