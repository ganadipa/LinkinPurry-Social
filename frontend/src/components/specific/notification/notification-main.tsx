import { MessageCircle, UserPlus, Briefcase, ThumbsUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotificationMain = () => {
  const notifications = [
    {
      id: 1,
      type: "connection",
      icon: <UserPlus className="h-8 w-8 text-blue-500" />,
      content: "Sarah Miller accepted your connection request",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      type: "like",
      icon: <ThumbsUp className="h-8 w-8 text-blue-500" />,
      content: "John Davis liked your recent post about web development",
      time: "3h ago",
      read: false,
    },
    {
      id: 3,
      type: "job",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      content: "New job matches are available in your area",
      time: "5h ago",
      read: true,
    },
    {
      id: 4,
      type: "message",
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      content: "You have a new message from Alex Thompson",
      time: "1d ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 bg-transparent border-none outline-none shadow-none hover:bg-transparent">
          <div className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0">
            <img
              src="/images/bell.png"
              alt="Messages"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <Badge className="absolute top-[.5px] px-2 bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0">
        <div className="px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-80">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex-shrink-0">{notification.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{notification.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className="w-full text-sm text-blue-600 hover:text-blue-700"
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMain;
