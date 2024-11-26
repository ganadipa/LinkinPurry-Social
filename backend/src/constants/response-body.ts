import { User } from "../models/user.model";
import { Post } from "./types";

export type TGetProfileBodyResponseByPublic = {
  username: string;
  name: string;
  work_history: string | null;
  skills: string | null;
  connection_count: number;
  profile_photo: string;
};

export type TGetProfileBodyResponseByAuthenticated =
  TGetProfileBodyResponseByPublic & {
    relevant_posts: Post[];
  };
