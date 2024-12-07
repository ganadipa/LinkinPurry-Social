import { Post } from "./feed";

export type Profile = {
  username: string;
  name: string;
  profile_photo: string;
  work_history: string | null;
  skills: string | null;
  connection_count: number;
};

export type ProfileWithPosts = Profile & {
  relevant_posts: Post[];
};
