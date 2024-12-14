import { ErrorSchema } from "@/schemas/error.schema";
import { CreatePostSuccessSchema, DeletePostSuccessSchema } from "@/schemas/feed.schema";
import { Post } from "@/types/feed";
import { Profile } from "@/types/profile";
import { profileResponse } from "@/types/response";
import { useEffect, useState } from "react";

export function useProfile(id: number) {
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    const response = await fetch(`/api/profile/${id}`);
    if (!response.ok) {
      setLoading(false);
      setSuccess(false);
      return;
    }

    const json = await response.json();
    console.log(json);
    const expected = profileResponse.safeParse(json);
    console.log("expected", expected);

    if (!expected.success) {
      setLoading(false);
      setSuccess(false);
      return;
    }

    if (expected.data.success) {
      const data = expected.data.body;
      const profile = {
        username: data.username,
        name: data.name,
        profile_photo: data.profile_photo,
        work_history: data.work_history,
        skills: data.skills,
        connection_count: data.connection_count,
      };

      let rel_posts: Post[] = [];
      if (data.relevant_posts) {
        rel_posts = data.relevant_posts.map((post) => {
          if (!post.created_at) {
            throw new Error("Post created_at somehow missing");
          }

          if (!post.updated_at) {
            throw new Error("Post updated_at somehow missing");
          }

          return {
            id: post.id,
            content: post.content,
            created_at: post.created_at,
            updated_at: post.updated_at,
          };
        });
      }

      setProfile(profile);
      setPosts(rel_posts);
      setSuccess(true);
      setLoading(false);
      return;
    }

    setSuccess(false);
    setLoading(false);
  };

  const updatePost = async (id: number, content: string) => {
    const response = await fetch(`/api/feed/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    const data = await response.json();
    const failureCheck = ErrorSchema.safeParse(data);
    if (failureCheck.success) {
      throw new Error(failureCheck.data.message);
    }

    const expect = CreatePostSuccessSchema.safeParse(data);
    if (!expect.success) {
      throw new Error("Server response was not as expected");
    }

    if (!expect.data.success) {
      throw new Error("Failed to update post");
    }

    if (expect.data.body === null) {
      throw new Error("Failed to update post");
    }

    if (posts === null) {
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        return {
          ...post,
          content,
        };
      }

      return post;
    });

    setPosts(updatedPosts);
  }

  const deletePost = async (id: number) => {
    const response = await fetch(`/api/feed/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    const data = await response.json();
    const failureCheck = ErrorSchema.safeParse(data);
    if (failureCheck.success) {
      throw new Error(failureCheck.data.message);
    }

    const expect = DeletePostSuccessSchema.safeParse(data);
    if (!expect.success) {
      throw new Error("Server response was not as expected");
    }

    if (!expect.data.success) {
      throw new Error("Failed to delete post");
    }

    if (posts === null) {
      return;
    }

    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  }

  return {
    success,
    profile,
    loading,
    posts,
    updatePost,
    deletePost,
  };
}
