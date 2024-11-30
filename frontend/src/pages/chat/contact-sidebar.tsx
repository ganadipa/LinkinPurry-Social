import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Contact, Message } from "../../types/chat";
import { cn } from "@/lib/utils";

type ContactSidebarProps = {
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  className?: string;
};

export function ContactSidebar({
  contacts,
  selectedContact,
  setSelectedContact,
  className,
}: ContactSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchQuery]);

  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    const updatedContacts = contacts.map((c) =>
      c.user_id === contact.user_id ? { ...c, unreadCount: 0 } : c
    );
    setFilteredContacts(updatedContacts);
  };

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
            className={`w-full text-left p-4 hover:bg-[#eef3f8] transition-colors duration-200 ${
              selectedContact?.user_id === contact.user_id ? "bg-[#eef3f8]" : ""
            }`}
            onClick={() => handleContactSelect(contact)}
          >
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage
                    src={contact.profile_photo_path}
                    alt={contact.full_name}
                  />
                  <AvatarFallback>{contact.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#00000099] truncate">
                  {contact.last_message}
                </p>
                <span className="text-xs text-[#00000099]">
                  {contact.last_message_time}
                </span>
              </div>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
