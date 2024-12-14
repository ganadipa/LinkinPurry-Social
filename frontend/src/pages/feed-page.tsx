import { useState, useEffect, useRef, KeyboardEvent } from "react";
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
import { Link } from "@tanstack/react-router";
import Recommendations from "@/components/specific/feed/recommendation";
import ProfileCard from "@/components/specific/feed/profile-card";

const MAX_CHARS = 280;

const Feed = () => {
  const {
    feed,
    loading,
    hasMore,
    fetchFeed,
    updatePost,
    deletePost,
    createPost,
  } = useFeed();
  const { isLoading, user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);

  const handleNewPostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= MAX_CHARS) {
      setNewPost(content);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= MAX_CHARS) {
      setEditContent(content);
    }
  };

  // Initial feed load
  useEffect(() => {
    const loadInitialFeed = async () => {
      try {
        const initialCursor = await fetchFeed(null);
        if (initialCursor) {
          setCursor(initialCursor);
        }
      } catch (error) {
        console.error("Error loading initial feed:", error);
        toast.error("Failed to load feed");
      }
    };

    if (!loading && feed === null) {
      loadInitialFeed();
    }
  }, [loading, feed, fetchFeed]);

  // Infinite scroll handling
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetchingMore && feed) {
          try {
            setIsFetchingMore(true);
            const newCursor = await fetchFeed(cursor);
            if (newCursor !== undefined) {
              setCursor(newCursor);
            }
          } catch (error) {
            console.error("Error fetching more posts:", error);
            toast.error("Failed to load more posts");
          } finally {
            setIsFetchingMore(false);
          }
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverTarget = observerTarget.current;
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [feed, hasMore, isFetchingMore, fetchFeed, cursor]);

  if (loading || feed === null || isLoading) {
    return <Loading />;
  }

  if (!user) {
    redirect({
      to: "/signin",
      params: { redirect: "/" },
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
    if (editContent.trim() && editContent.length <= MAX_CHARS) {
      const promise = updatePost(postId, editContent);
      toast.promise(promise, {
        loading: "Updating post...",
        success: "Post updated",
        error: (err) => err.message || "Failed to update post",
      });
      setEditingId(null);
    }
  };

  const handleDelete = (postId: number) => {
    const promise = deletePost(postId);
    toast.promise(promise, {
      loading: "Deleting post...",
      success: "Post deleted",
      error: (err) => err.message || "Failed to delete post",
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newPost.trim() && newPost.length <= MAX_CHARS) {
        setShowConfirmModal(true);
      }
    }
  };

  const handleSubmitPost = () => {
    if (newPost.trim() && newPost.length <= MAX_CHARS) {
      const promise = createPost(newPost);
      toast.promise(promise, {
        loading: "Posting...",
        success: "Post shared",
        error: (err) => err.message || "Failed to post",
      });
      setShowConfirmModal(false);
      setNewPost("");
    }
  };

  return (
    <div className="mx-auto px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="min-h-screen flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-20">
              <ProfileCard />
            </div>
          </div>

          <div className="flex-grow max-w-3xl">
            <Card className="mb-4 p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <img
                  src={user.profile_photo_path}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="relative">
                    <Textarea
                      placeholder="What do you want to talk about?"
                      value={newPost}
                      onChange={handleNewPostChange}
                      onKeyDown={handleKeyDown}
                      className="min-h-[100px] mb-2 resize-none"
                      maxLength={MAX_CHARS}
                    />
                    <span
                      className={`absolute bottom-4 right-4 text-sm ${
                        newPost.length >= MAX_CHARS ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {newPost.length}/{MAX_CHARS}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => newPost.trim() && setShowConfirmModal(true)}
                      className="bg-[#0A66C2] hover:bg-[#084c8e] text-white"
                      disabled={newPost.length > MAX_CHARS || !newPost.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              {feed?.map((item) => (
                <div
                  id={item.post.id.toString()}
                  key={item.post.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <Link
                      className="flex items-center space-x-3"
                      to="/profile/$id"
                      params={{
                        id: item.user.id.toString(),
                      }}
                    >
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
                    </Link>

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
                      <div className="relative">
                        <Textarea
                          value={editContent}
                          onChange={handleEditChange}
                          className="min-h-[100px] mb-2"
                          maxLength={MAX_CHARS}
                          autoFocus
                        />
                        <span
                          className={`absolute bottom-4 right-4 text-sm ${
                            editContent.length >= MAX_CHARS
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {editContent.length}/{MAX_CHARS}
                        </span>
                      </div>
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
                          disabled={
                            editContent.length > MAX_CHARS || !editContent.trim()
                          }
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

            <div
              ref={observerTarget}
              className="h-10 flex items-center justify-center"
            >
              {isFetchingMore && <div>Loading...</div>}
              {!hasMore && feed && feed.length > 0 && (
                <p className="text-gray-500 text-sm">No more posts to load</p>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <Recommendations />
            </div>
          </div>
        </div>

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
    </div>
  );
};

export default Feed;