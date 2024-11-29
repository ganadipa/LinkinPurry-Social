import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Contact, Message } from "./types";
import { cn } from "@/lib/utils";

const initialMessages: Message[] = [
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "5",
    content:
      "That's awesome! I'd love to hear more about what you're learning. Maybe we could discuss it over coffee sometime?",
    sender: "user",
    timestamp: new Date(Date.now() - 10000),
  },
];

interface ChatAreaProps {
  selectedContact: Contact | null;
  className?: string;
}

export default function ChatAreaMobile({
  selectedContact,
  className,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedContact) scrollToBottom();
  }, [messages]);

  if (selectedContact === null) {
    return (
      <div className={cn("self-center mx-auto", className)}>
        No chat is currently selected.
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateMessageResponse = () => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: `Thanks for your message! This is a simulated response from ${selectedContact.name}.`,
          sender: "contact",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
      simulateMessageResponse();
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={cn(`flex flex-col w-[70%]`, className)}>
      <div className="bg-white border-b border-[#e0e0e0] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage
              src={selectedContact.avatar}
              alt={selectedContact.name}
            />
            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-[#000000]">
              {selectedContact.name}
            </h2>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full p-4 bg-[#f8f9fa] overflow-y-auto">
        {messages.map((message, index) => {
          const isFirstInGroup =
            index === 0 || messages[index - 1].sender !== message.sender;
          const isLastInGroup =
            index === messages.length - 1 ||
            messages[index + 1].sender !== message.sender;

          return (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-4" : "mb-1"}`}
            >
              {message.sender === "contact" && isFirstInGroup && (
                <Avatar className="h-8 w-8 mr-2 mt-2">
                  <AvatarImage
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                  />
                  <AvatarFallback>
                    {selectedContact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${message.sender === "contact" && !isFirstInGroup ? "ml-10" : ""}`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-[#0a66c2] text-white"
                      : "bg-[#f2f2f2] text-[#000000]"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                {isLastInGroup && (
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs text-[#00000099]">
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {isTyping && (
        <div className="px-4 py-2 text-sm text-[#00000099] bg-white">
          {selectedContact.name} is typing...
        </div>
      )}

      <div className="p-4 bg-white border-t border-[#e0e0e0] flex items-center gap-2">
        <Input
          type="text"
          placeholder="Write a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-[#eef3f8] text-[#000000]"
        />
        <Button
          onClick={handleSendMessage}
          className="bg-[#0a66c2] hover:bg-[#004182] text-white"
          disabled={!inputMessage.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}
