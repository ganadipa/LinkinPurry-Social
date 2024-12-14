import { ErrorSchema } from "@/schemas/error.schema";
import {
  CreatePostSuccessSchema,
  DeletePostSuccessSchema,
  EditPostSuccessSchema,
  GetFeedSuccessSchema,
} from "@/schemas/feed.schema";
import { FeedRelated } from "@/types/feed";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const POSTS_PER_PAGE = 10;

export function useFeed() {
  const [feed, setFeed] = useState<FeedRelated[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchFeed = async (cursor: number | null) => {
    try {
      const url = new URL("/api/feed", window.location.origin);
      url.searchParams.append("limit", POSTS_PER_PAGE.toString());
      if (cursor) {
        url.searchParams.append("cursor", cursor.toString());
      }

      const response = await fetch(url);
      const data = await response.json();

      const failureCheck = ErrorSchema.safeParse(data);
      if (failureCheck.success) {
        throw new Error(failureCheck.data.message);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch feed");
      }

      const expect = GetFeedSuccessSchema.safeParse(data);
      if (!expect.success) {
        throw new Error("Server response was not as expected");
      }

      if (!expect.data.success) {
        throw new Error("Failed to fetch feed");
      }

      if (expect.data.body === null) {
        throw new Error("Failed to fetch feed");
      }

      if (expect.data.body.posts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      const cursorNumber = Number(expect.data.body.cursor);
      if (isNaN(cursorNumber)) {
        throw new Error("Failed to fetch feed");
      }

      setFeed((prevFeed) => {
        if (!cursor) return expect.data.body.posts;
        return [...(prevFeed || []), ...expect.data.body.posts];
      });

      let the_cursor = expect.data.body.cursor;
      if (typeof the_cursor === "string") {
        the_cursor = parseInt(the_cursor);
        if (isNaN(the_cursor)) {
          the_cursor = -1;
        }
      }

      return the_cursor;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }

    return cursor;
  };

  useEffect(() => {
    fetchFeed(null);
  }, []);

  const createPost = async (content: string) => {
    const response = await fetch("/api/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    const failureCheck = ErrorSchema.safeParse(data);
    if (failureCheck.success) {
      throw new Error(failureCheck.data.message);
    }

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    const expect = CreatePostSuccessSchema.safeParse(data);
    if (!expect.success) {
      throw new Error("Server response was not as expected");
    }

    if (!expect.data.success) {
      throw new Error("Failed to create post");
    }

    if (expect.data.body === null) {
      throw new Error("Failed to create post");
    }

    if (feed === null) {
      return;
    }

    setFeed([expect.data.body, ...feed]);
  };

  const updatePost = async (id: number, content: string) => {
    const response = await fetch(`/api/feed/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    const failureCheck = ErrorSchema.safeParse(data);
    if (failureCheck.success) {
      throw new Error(failureCheck.data.message);
    }

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    const expect = EditPostSuccessSchema.safeParse(data);
    if (!expect.success) {
      throw new Error("Server response was not as expected");
    }

    if (!expect.data.success) {
      throw new Error("Failed to update post");
    }

    if (expect.data.body === null) {
      throw new Error("Failed to update post");
    }

    if (feed === null) {
      return;
    }

    setFeed(
      feed.map((post) => {
        if (post.post.id === id) {
          return expect.data.body;
        }

        return post;
      })
    );
  };

  const deletePost = async (id: number) => {
    const response = await fetch(`/api/feed/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    const failureCheck = ErrorSchema.safeParse(data);
    if (failureCheck.success) {
      throw new Error(failureCheck.data.message);
    }

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    const expect = DeletePostSuccessSchema.safeParse(data);
    if (!expect.success) {
      throw new Error("Server response was not as expected");
    }

    if (!expect.data.success) {
      throw new Error("Failed to delete post");
    }

    if (feed === null) {
      return;
    }

    setFeed(feed.filter((post) => post.post.id !== id));
  };

  return {
    feed,
    loading,
    hasMore,
    fetchFeed,
    createPost,
    updatePost,
    deletePost,
  };
}
