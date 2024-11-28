import React, { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Clock, X, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedRelated } from "@/types/feed";

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      post: {
        content:
          "Excited to announce that I've just launched a new project! #innovation #tech",
        id: 1,
        created_at: Date.now() - 3600000,
        updated_at: Date.now() - 3600000,
      },
      user: {
        username: "johndoe",
        fullname: "John Doe",
        profile_photo_path: "/api/placeholder/32/32",
      },
    },
    {
      post: {
        content:
          "Great meeting with the team today discussing future strategies! 🚀",
        id: 2,
        created_at: Date.now() - 7200000,
        updated_at: Date.now() - 3600000,
      },
      user: {
        username: "janedoe",
        fullname: "Jane Doe",
        profile_photo_path: "/api/placeholder/32/32",
      },
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleEdit = (post: FeedRelated) => {
    setEditingId(post.post.id);
    setEditContent(post.post.content);
  };

  const handleSaveEdit = (postId: number) => {
    setPosts(
      posts.map((p) =>
        p.post.id === postId
          ? {
              ...p,
              post: {
                ...p.post,
                content: editContent,
                updated_at: Date.now(),
              },
            }
          : p
      )
    );
    setEditingId(null);
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter((p) => p.post.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((item) => (
        <div
          key={item.post.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={item.user.profile_photo_path}
                alt={item.user.fullname}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {item.user.fullname}
                </h3>
                <div className="text-sm text-gray-500 flex items-center flex-wrap">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(item.post.created_at)}
                  </span>
                  {item.post.updated_at !== item.post.created_at && (
                    <span className="ml-2 text-gray-400">
                      • Edited {formatTime(item.post.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {editingId !== item.post.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit post
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(item.post.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {editingId === item.post.id ? (
            <div className="mt-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] mb-2"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(null)}
                  className="h-8"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(item.post.id)}
                  className="h-8"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-gray-800 whitespace-pre-wrap">
              {item.post.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
