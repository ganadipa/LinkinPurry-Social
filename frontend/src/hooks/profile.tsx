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

    if (!expected.success) {
      setLoading(false);
      setSuccess(false);
      return;
    }

    if (expected.data.success) {
      const data = expected.data.body;
      console.log(data);
      const profile = {
        username: data.username,
        name: data.name,
        profile_photo: data.profile_photo,
        work_history: data.work_history,
        skills: data.skills,
        connection_count: data.connection_count,
      };

      const rel_posts = data.relevant_posts.map((post) => {
        if (!post.created_at) {
          throw new Error("Post created_at somehow missing");
        }

        if (!post.updated_at) {
          throw new Error("Post updated_at somehow missing");
        }

        return {
          id: post.id,
          content: post.content,
          created_at: new Date(post.created_at).toLocaleDateString(),
          updated_at: new Date(post.updated_at).toLocaleDateString(),
        };
      });

      setProfile(profile);
      setPosts(rel_posts);
      setSuccess(true);
      setLoading(false);
      return;
    }

    setSuccess(false);
    setLoading(false);
  };

  return {
    success,
    profile,
    loading,
    posts,
  };
}
