import React, { useState, useRef, useEffect } from "react";
import { Contact, Message } from "./types";
import { ContactSidebar } from "./contact-sidebar";
import ChatArea from "./chat-area";
import ChatAreaMobile from "./chat-area-mobile";

const contacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sure, let's catch up soon!",
    lastMessageTime: "2h ago",
    status: "online",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "bruh",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sure, let's catch up soon!",
    lastMessageTime: "2h ago",
    status: "online",
    unreadCount: 3,
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sure, let's catch up soon!",
    lastMessageTime: "2h ago",
    status: "online",
    unreadCount: 3,
  },
];

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="flex h-[80vh] bg-[#f3f2ef] md:mt-8 border border-1 border-[#e0e0e0] rounded-lg overflow-hidden">
      <ContactSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        className="max-md:w-full"
      />

      <ChatArea selectedContact={selectedContact} className="max-md:hidden" />
      <ChatAreaMobile
        selectedContact={selectedContact}
        className="hidden max-md:flex"
      />
    </div>
  );
}
