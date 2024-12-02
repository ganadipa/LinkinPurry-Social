import { ContactSidebar } from "./contact-sidebar";
import ChatArea from "./chat-area";
import ChatAreaMobile from "./chat-area-mobile";
import { useChat } from "@/hooks/chat";
import Loading from "@/components/loading";

export default function ChatPage() {
  const {
    contacts,
    selectedContact,
    handleContactSelect,
    isLoading,
    messages,
    setMessages,
    isChatLoading,
  } = useChat();
  if (isLoading) {
    return <Loading />;
  }

  if (!contacts) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex h-[80vh] bg-[#f3f2ef] md:mt-8 border border-1 border-[#e0e0e0] rounded-lg overflow-hidden">
      <ContactSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        handleContactSelect={handleContactSelect}
        className="max-md:w-full"
      />
      <ChatArea
        selectedContact={selectedContact}
        className="max-md:hidden"
        messages={messages}
        setMessages={setMessages}
        isChatLoading={isChatLoading}
      />
      {/* <ChatAreaMobile
        selectedContact={selectedContact}
        className="hidden max-md:flex"
      /> */}
    </div>
  );
}
