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

      setProfile(profile);
      setPosts(data.relevant_posts);
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
