import { redirect, wait } from "@/lib/utils";
import { ErrorSchema } from "@/schemas/error.schema";
import {
  ChatSpecificResponseSuccessSchema,
  Contact,
  ContactsResponseSuccessSchema,
  Message,
} from "@/types/chat";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useChat() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const prepare = async () => {
    const response = await fetch("/api/chat/contacts");
    const data = await response.json();
    if (response.status === 401) {
      await wait(1000);
      redirect({
        to: "/signin",
        params: {
          redirect: "/chat",
        },
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
      redirect({
        to: "/",
      });
      return;
    }

    const result = ContactsResponseSuccessSchema.safeParse(data);
    if (!result.success) {
      await wait(1000);
      redirect({
        to: "/",
      });
      return;
    }

    if (!result.data.success) {
      await wait(1000);
      redirect({
        to: "/",
      });
      return;
    }

    setContacts(result.data.body);
    setIsLoading(false);
  };

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsChatLoading(true);
    const response = await fetch(`/api/chat/${contact.user_id}`);
    if (!response.ok) {
      toast.error("Failed to fetch messages");
      setIsChatLoading(false);
      return;
    }

    const data = await response.json();
    const error = ErrorSchema.safeParse(data);
    if (error.success) {
      toast.error(error.data.message);
      setIsChatLoading(false);
      return;
    }

    const result = ChatSpecificResponseSuccessSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.message);
      setIsChatLoading(false);
      return;
    }

    console.log(result.data);
    if (!result.data.success) {
      toast.error(result.data.message);
      setIsChatLoading(false);
      return;
    }

    setMessages(result.data.body);
    setIsChatLoading(false);
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
    handleContactSelect,
    setContacts,
    setMessages,
  };
}
