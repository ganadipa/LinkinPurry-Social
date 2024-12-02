import { ErrorSchema } from "@/schemas/error.schema";
import {
  CreatePostSuccessSchema,
  DeletePostSuccessSchema,
  EditPostSuccessSchema,
  GetFeedSuccessSchema,
} from "@/schemas/feed.schema";
import { FeedRelated } from "@/types/feed";
import { useEffect, useState } from "react";

export function useFeed() {
  const [feed, setFeed] = useState<FeedRelated[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFeed = async () => {
    try {
      const response = await fetch("/api/feed");
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

      setFeed(expect.data.body);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
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

  return { feed, loading, fetchFeed, createPost, updatePost, deletePost };
}
