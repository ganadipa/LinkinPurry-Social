import { useState, KeyboardEvent } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Clock,
  X,
  Check,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FeedRelated } from "@/types/feed";
import { useFeed } from "@/hooks/feed";
import Loading from "@/components/loading";
import { useAuth } from "@/hooks/auth";
import { redirect } from "@/lib/utils";
import toast from "react-hot-toast";

const Feed = () => {
  const { feed, loading, updatePost, deletePost, createPost } = useFeed();
  const { isLoading, user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  if (loading || feed === null || isLoading) {
    return <Loading />;
  }

  if (!user) {
    redirect({
      to: "/signin",
      params: {
        redirect: "/",
      },
    });
    return null;
  }

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
    const promise = updatePost(postId, editContent);
    toast.promise(promise, {
      loading: "Updating post...",
      success: "Post updated",
      error: (err) => {
        if (err.message) return err.message;
        return "Failed to update post";
      },
    });
    setEditingId(null);
  };

  const handleDelete = (postId: number) => {
    const promise = deletePost(postId);
    toast.promise(promise, {
      loading: "Deleting post...",
      success: "Post deleted",
      error: (err) => {
        if (err.message) return err.message;
        return "Failed to delete post";
      },
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newPost.trim()) {
        setShowConfirmModal(true);
      }
    }
  };

  const handleSubmitPost = () => {
    const promise = createPost(newPost);
    toast.promise(promise, {
      loading: "Posting...",
      success: "Post shared",
      error: (err) => {
        if (err.message) return err.message;
        return "Failed to post";
      },
    });

    setShowConfirmModal(false);
    setNewPost("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={user.profile_photo_path}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <Textarea
              placeholder="What do you want to talk about?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] mb-2 resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => newPost.trim() && setShowConfirmModal(true)}
                className="bg-[#0A66C2] hover:bg-[#084c8e] text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {feed.map((item) => (
        <div
          id={item.post.id.toString()}
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

            {editingId !== item.post.id &&
              item.user.username === user.username && (
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

      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to share this post with your connections?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {newPost}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitPost}
              className="bg-[#0A66C2] hover:bg-[#084c8e] text-white"
            >
              Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Feed;
