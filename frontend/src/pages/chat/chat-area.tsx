import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Contact, Message } from "../../types/chat";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useChat } from "@/hooks/chat";

interface ChatAreaProps {
  selectedContact: Contact | null;
  className?: string;
}

export default function ChatArea({
  selectedContact,
  className,
}: ChatAreaProps) {
  const { messages, setMessages, isChatLoading } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedContact) scrollToBottom();
  }, [messages, selectedContact]);

  if (selectedContact === null) {
    return <div className="self-center mx-auto">No contact selected</div>;
  }

  if (isChatLoading) {
    return <div className="self-center mx-auto">Loading...</div>;
  }

  if (messages === null) {
    return (
      <div className="self-center mx-auto">Something terrible happened</div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        content: inputMessage,
        sender: 1,
        timestamp: new Date().getTime(),
      };
      setMessages((prev) => {
        if (prev === null) return [newMessage];
        return [...prev, newMessage];
      });
      setInputMessage("");
    }
  };

  const formatMessageTime = (dateNumber: number) => {
    const date = new Date(dateNumber);
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
              src={selectedContact.profile_photo_path}
              alt={selectedContact.full_name}
            />
            <AvatarFallback>
              {selectedContact.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-[#000000]">
              {selectedContact.full_name}
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
              className={`flex ${message.sender === user?.id ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-4" : "mb-1"}`}
            >
              {message.sender === user?.id && isFirstInGroup && (
                <Avatar className="h-8 w-8 mr-2 mt-2">
                  <AvatarImage
                    src={selectedContact.profile_photo_path}
                    alt={selectedContact.full_name}
                  />
                  <AvatarFallback>
                    {selectedContact.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${message.sender === user?.id && !isFirstInGroup ? "ml-10" : ""}`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === user?.id
                      ? "bg-[#0a66c2] text-white"
                      : "bg-[#f2f2f2] text-[#000000]"
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={cn("text-xs text-end text-white", {
                      "text-[#00000099]": message.sender !== user?.id,
                      "text-start": message.sender === user?.id,
                    })}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {isTyping && (
        <div className="px-4 py-2 text-sm text-[#00000099] bg-white">
          {selectedContact.full_name} is typing...
        </div>
      )}

      <div className="p-4 bg-white border-t border-[#e0e0e0] flex items-center gap-2">
        <Input
          type="text"
          placeholder="Write a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
