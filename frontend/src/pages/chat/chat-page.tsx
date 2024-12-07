import { ContactSidebar } from "./contact-sidebar";
import ChatArea from "./chat-area";
import ChatAreaMobile from "./chat-area-mobile";
import { useChat } from "@/hooks/chat";
import Loading from "@/components/loading";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { user } = useAuth();
  const {
    contacts,
    selectedContact,
    handleContactSelect,
    setSelectedContact,
    isLoading,
    messages,
    isChatLoading,
    sendMessage,
    sendTypingStatus,
    isTyping: isOtherTyping,
  } = useChat({ user_id: user?.id });

  if (isLoading) {
    return <Loading />;
  }

  if (!contacts) {
    return <div>Something went wrong</div>;
  }

  const theContact = contacts.find(
    (contact) => contact.user_id === selectedContact
  );

  return (
    <div className="flex h-[80vh] bg-[#f3f2ef] md:mt-8 border border-1 border-[#e0e0e0] rounded-lg overflow-hidden">
      <ContactSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        handleContactSelect={handleContactSelect}
        className={cn("max-md:w-full", {
          "max-md:hidden": selectedContact !== null,
        })}
      />
      <ChatArea
        selectedContact={theContact ?? null}
        className="max-md:hidden"
        messages={messages}
        isChatLoading={isChatLoading}
        sendMessage={sendMessage}
        isOtherTyping={isOtherTyping}
        sendTypingStatus={sendTypingStatus}
      />
      <ChatAreaMobile
        selectedContact={theContact ?? null}
        className={cn("hidden max-md:flex", {
          "max-md:hidden": selectedContact === null,
        })}
        messages={messages}
        isChatLoading={isChatLoading}
        sendMessage={sendMessage}
        isOtherTyping={isOtherTyping}
        sendTypingStatus={sendTypingStatus}
        setSelectedContact={setSelectedContact}
      />
    </div>
  );
}
