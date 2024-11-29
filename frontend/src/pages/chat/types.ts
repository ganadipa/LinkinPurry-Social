export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  status: "online" | "offline" | "away";
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "contact";
  timestamp: Date;
}
