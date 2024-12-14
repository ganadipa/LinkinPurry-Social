import { redirect, wait } from "@/lib/utils";
import { ErrorSchema } from "@/schemas/error.schema";
import {
  ChatSpecificResponseSuccessSchema,
  Contact,
  ContactsResponseSuccessSchema,
  Message,
  MessageSchema,
} from "@/types/chat";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { z } from "zod";

const socket = io("http://localhost:3000", {
  path: "/ws",
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

export function useChat({ user_id }: { user_id: number | undefined }) {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    console.log("Socket initialization state:", {
      isConnected: socket.connected,
      id: socket.id,
      transport: socket.io.engine?.transport?.name,
    });

    const onConnect = () => {
      console.log("WebSocket connected:", {
        id: socket.id,
        transport: socket.io.engine?.transport?.name,
      });
      setSocketConnected(true);
    };

    const onConnectError = (error: Error) => {
      console.error("WebSocket connection error:", {
        errorMessage: error.message,
        transportType: socket.io.engine?.transport?.name,
        readyState: socket.io.engine?.readyState,
      });
      setSocketConnected(false);
    };

    const onDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!selectedContact || !user_id || !socketConnected) return;

    const roomName = [selectedContact, user_id].sort().join("-");

    console.log("Joining room:", roomName);
    socket.emit("join_room", { roomName });

    const onNewMessage = (newMessage: unknown) => {
      const schema = MessageSchema.extend({
        receiver: z.number(),
      });
      const expect = schema.safeParse(newMessage);
      if (expect.success) {
        setMessages((prev) => (prev ? [...prev, expect.data] : [expect.data]));
        setContacts((contacts) => {
          if (!contacts) return null;
          const contact = contacts.find(
            (contact) =>
              (contact.user_id === expect.data.receiver &&
                contact.user_id !== user_id) ||
              (contact.user_id === expect.data.sender &&
                contact.user_id !== user_id)
          );

          if (!contact) return contacts;
          console.log("Updating contact:", expect.data);
          return [
            {
              ...contact,
              last_message: expect.data.content,
              last_message_time: expect.data.timestamp,
            },
            ...contacts.filter((c) => c.user_id !== contact.user_id),
          ];
        });
      } else {
        throw new Error("Failed to parse message");
      }
    };

    const onTypingStatus = ({
      isTyping: typing,
      userId,
    }: {
      isTyping: boolean;
      userId: number;
    }) => {
      if (userId === selectedContact) {
        setIsTyping(typing);
      }
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing_status", onTypingStatus);

    return () => {
      console.log("Leaving room:", roomName);
      socket.emit("leave_room", { roomName });
      socket.off("new_message", onNewMessage);
      socket.off("typing_status", onTypingStatus);
    };
  }, [selectedContact, user_id, socketConnected]);

  const sendMessage = async (content: string) => {
    if (!selectedContact || !socketConnected || !user_id) return;

    const roomName = [selectedContact, user_id].sort().join("-");
    const messageData: Omit<Message, "id"> & {
      roomName: string;
    } = {
      content,
      roomName,
      sender: user_id,
      timestamp: Date.now(),
    };

    socket.emit("send_message", messageData);
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (!selectedContact || !socketConnected || !user_id) return;

    const roomName = [selectedContact, user_id].sort().join("-");
    socket.emit("typing", {
      roomName,
      isTyping,
      userId: user_id,
    });
  };

  // Initial contacts loading
  const prepare = async () => {
    const response = await fetch("/api/chat/contacts");
    const data = await response.json();

    if (response.status === 401) {
      await wait(1000);
      redirect({
        to: "/signin",
        params: { redirect: "/chat" },
      });
      return;
    }

    const error = ErrorSchema.safeParse(data);
    if (error.success) {
      toast(error.data.message);
      return;
    }

    if (!response.ok) {
      await wait(1000);
      redirect({ to: "/" });
      return;
    }

    const result = ContactsResponseSuccessSchema.safeParse(data);
    if (!result.success || !result.data.success) {
      await wait(1000);
      redirect({ to: "/" });
      return;
    }

    setContacts(result.data.body);
    setIsLoading(false);
  };

  const handleContactSelect = async (other_id: number) => {
    setSelectedContact(other_id);
    setIsChatLoading(true);
    let ok = true;

    try {
      const response = await fetch(`/api/chat/${other_id}`);
      const data = await response.json();

      const error = ErrorSchema.safeParse(data);
      if (error.success) {
        throw new Error(error.data.message);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = ChatSpecificResponseSuccessSchema.safeParse(data);
      if (!result.success || !result.data.success) {
        console.log(result.error);
        throw new Error("Failed to fetch messages");
      }

      setMessages(result.data.body);
    } catch (error) {
      ok = false;
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsChatLoading(false);
    }
    console.log("Returning ok:", ok);
    return ok;
  };

  useEffect(() => {
    prepare();
  }, []);

  return {
    contacts,
    selectedContact,
    messages,
    isLoading,
    isChatLoading,
    isTyping,
    socketConnected,
    handleContactSelect,
    setContacts,
    setMessages,
    sendMessage,
    sendTypingStatus,
    setSelectedContact,
  };
}
