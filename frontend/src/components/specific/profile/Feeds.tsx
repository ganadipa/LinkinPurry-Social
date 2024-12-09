import { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Clock, X, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/types/feed";
import { useAuth } from "@/hooks/auth";
import Loading from "@/components/loading";
import toast from "react-hot-toast";
import { Profile } from "@/types/profile";

interface FeedsProps {
  profile: Profile;
  posts: Post[];
  loading: boolean;
  updatePost: (postId: number, content: string) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
}

export const Feeds = ({
  posts,
  loading,
  updatePost,
  deletePost,
  profile,
}: FeedsProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [feedProfile, setFeedProfile] = useState<Post[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (posts) {
      setFeedProfile(posts);
    }
  }, [posts]);

  if (loading || !feedProfile) {
    return <Loading />;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId: number) => {
    try {
      await updatePost(postId, editContent);
      setFeedProfile((prevFeed) => {
        if (!prevFeed) return null;
        return prevFeed.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              content: editContent,
              updated_at: Date.now(),
            };
          }
          return post;
        });
      });
      toast.success("Post updated");
      setEditingId(null);
    } catch {
      toast.error("Failed to update post");
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
      setFeedProfile((prevFeed) => {
        if (!prevFeed) return null;
        return prevFeed.filter((post) => post.id !== postId);
      });
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="space-y-4">
      {feedProfile.map((item) => {
        return (
          <div
            id={item.id?.toString()}
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profile.name}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center flex-wrap">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.created_at ? formatTime(item.created_at) : ""}
                    </span>
                    {item.updated_at !== item.created_at && (
                      <span className="ml-2 text-gray-400">
                        • Edited{" "}
                        {item.updated_at ? formatTime(item.updated_at) : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {user?.username === profile.username && (
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
                      onClick={() => handleDelete(item.id as number)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingId === item.id ? (
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
                    onClick={() => handleSaveEdit(item.id as number)}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-gray-800 whitespace-pre-wrap">
                {item.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
