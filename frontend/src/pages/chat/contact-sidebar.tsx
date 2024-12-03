import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Contact } from "../../types/chat";
import { cn } from "@/lib/utils";

type ContactSidebarProps = {
  contacts: Contact[];
  selectedContact: Contact | null;
  handleContactSelect: (contact: Contact) => void;
  className?: string;
};

const formatLastMessageTime = (time: number) => {
  let ret = "";
  if (new Date().getTime() - time < 86400000) {
    ret = new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (new Date().getTime() - time < 604800000) {
    ret = new Date(time).toLocaleDateString([], {
      weekday: "short",
    });
  } else {
    ret = new Date(time).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
  return ret;
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export function ContactSidebar({
  contacts,
  selectedContact,
  handleContactSelect,
  className,
}: ContactSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const [filteredContacts, setFilteredContacts] = useState(contacts);

  return (
    <div
      className={cn(
        `bg-white border-r border-[#e0e0e0] flex flex-col w-[30%]`,
        className
      )}
    >
      <div className="p-4 border-b border-[#e0e0e0]">
        <h2 className="text-xl font-semibold text-[#000000] mb-4">Messaging</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search messages"
            className="pl-10 bg-[#eef3f8] text-[#000000]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00000099]"
            size={20}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredContacts.map((contact) => (
          <button
            key={contact.user_id}
            className={`w-full text-left p-4 hover:bg-[#eef3f8] transition-colors duration-200 
              ${
                selectedContact?.user_id === contact.user_id
                  ? "bg-[#eef3f8]"
                  : ""
              }`}
            onClick={() => handleContactSelect(contact)}
          >
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage
                  src={contact.profile_photo_path}
                  alt={contact.full_name}
                  className="h-12 w-12 rounded-full"
                />
                <AvatarFallback>{contact.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 min-w-0">
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-black truncate">
                    {truncateText(contact.full_name, 20)}
                  </p>
                  <p className="text-sm text-[#00000099] truncate">
                    {contact.last_message
                      ? truncateText(contact.last_message, 10)
                      : ""}
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-[#00000099] truncate">
                    {contact.last_message_time
                      ? formatLastMessageTime(contact.last_message_time)
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
