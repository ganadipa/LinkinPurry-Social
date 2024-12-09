import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Contact, Message } from "../../types/chat";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";

interface ChatAreaProps {
  selectedContact: Contact | null;
  className?: string;
  messages: Message[] | null;
  sendMessage: (message: string) => void;
  isChatLoading: boolean;
  sendTypingStatus: (isTyping: boolean) => void;
  isOtherTyping: boolean;
}

export default function ChatArea({
  selectedContact,
  className,
  messages,
  isChatLoading,
  sendMessage,
  isOtherTyping,
  sendTypingStatus,
}: ChatAreaProps) {
  const [inputMessage, setInputMessage] = useState("");
  const isTyping = inputMessage.length > 0;
  const { user } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedContact) scrollToBottom();
  }, [messages, selectedContact]);

  useEffect(() => {
    sendTypingStatus(isTyping);
  }, [isTyping]);

  if (selectedContact === null) {
    return (
      <div className={`self-center mx-auto ${className}`}>
        No contact selected
      </div>
    );
  }

  if (isChatLoading) {
    return <div className={`self-center mx-auto ${className}`}>Loading...</div>;
  }

  if (messages === null) {
    return (
      <div className={`self-center mx-auto ${className}`}>
        Something terrible happened
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
      //   toast.success("Message sent.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const formatMessageTime = (dateNumber: number) => {
    const date = new Date(dateNumber);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowTimeDivider = (
    currentMsg: Message,
    prevMsg: Message | null
  ) => {
    if (!prevMsg) return true;

    const currentTime = new Date(currentMsg.timestamp);
    const prevTime = new Date(prevMsg.timestamp);
    const diffMinutes =
      (currentTime.getTime() - prevTime.getTime()) / (1000 * 60);

    return diffMinutes > 30;
  };

  const formatTimeDivider = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${formatMessageTime(timestamp)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${formatMessageTime(timestamp)}`;
    } else {
      return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        }) + ` at ${formatMessageTime(timestamp)}`
      );
    }
  };

  return (
    <div className={cn(`flex flex-col lg:w-[70%] w-3/5`, className)}>
      <div className="bg-white border-b border-[#e0e0e0] p-4 flex items-center justify-between">
        <Link
          className="flex items-center"
          to="/profile/$id"
          params={{
            id: selectedContact.user_id.toString(),
          }}
        >
          <Avatar className="h-12 w-12 mr-3 flex justify-center items-center">
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
        </Link>
      </div>
      <ScrollArea className="h-full p-4 bg-[#f8f9fa] overflow-y-auto">
        <div className="space-y-1">
          {messages.map((message, index) => {
            const isFirstInGroup =
              index === 0 || messages[index - 1].sender !== message.sender;
            const isLastInGroup =
              index === messages.length - 1 ||
              messages[index + 1].sender !== message.sender;
            const isOwnMessage = message.sender === user?.id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showTimeDivider = shouldShowTimeDivider(message, prevMessage);

            return (
              <React.Fragment key={message.id}>
                {showTimeDivider && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                      {formatTimeDivider(message.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  key={message.id}
                  className={cn("flex items-start gap-2", {
                    "justify-end": isOwnMessage,
                    "justify-start": !isOwnMessage,
                    "mb-4": isLastInGroup,
                    "mb-1": !isLastInGroup,
                  })}
                >
                  {!isOwnMessage && isFirstInGroup && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage
                        src={selectedContact.profile_photo_path}
                        alt={selectedContact.full_name}
                      />
                      <AvatarFallback>
                        {selectedContact.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {!isOwnMessage && !isFirstInGroup && (
                    <div className="w-8 flex-shrink-0" />
                  )}
                  <div
                    className={cn("flex flex-col", {
                      "items-end": isOwnMessage,
                      "items-start": !isOwnMessage,
                    })}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-lg break-words max-w-[300px]",
                        {
                          "bg-[#0a66c2] text-white": isOwnMessage,
                          "bg-[#f2f2f2] text-[#000000]": !isOwnMessage,
                        }
                      )}
                    >
                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {message.content}
                      </p>
                      <p
                        className={cn("text-xs mt-1", {
                          "text-white/80": isOwnMessage,
                          "text-black/60": !isOwnMessage,
                        })}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      {isOtherTyping && (
        <div className="px-4 py-2 text-sm text-[#00000099] bg-white">
          {selectedContact.full_name} is typing...
        </div>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-[#e0e0e0] flex items-end gap-2"
      >
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex-1 bg-[#eef3f8] text-[#000000] resize-none"
          rows={3}
        />
        <Button
          type="submit"
          className="bg-[#0a66c2] hover:bg-[#004182] text-white"
          disabled={!inputMessage.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  );
}
