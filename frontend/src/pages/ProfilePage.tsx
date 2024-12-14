import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import { useProfile } from "@/hooks/profile";
import Loading from "@/components/loading";
import ProfileHeader from "@/components/specific/profile/ProfileHeader";
import WorkHistory from "@/components/specific/profile/WorkHistory";
import Skills from "@/components/specific/profile/Skills";
import { useTitle } from "@/hooks/title";
import { Feeds } from "@/components/specific/profile/Feeds";
import ProfileNotFound from "./not-found/ProfileNotFound";
import toast from "react-hot-toast";
import { Post } from "@/types/feed";

export default function ProfilePage({ id }: { id: number }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    profile,
    loading: isProfileLoading,
    posts,
    deletePost,
    updatePost,
  } = useProfile(id);
  let showing: Post[] = [];
  if (posts) {
    showing = posts;
  }
  const LIMIT_3 = Math.min(3, showing.length);
  const LIMITED_POSTS = showing.slice(0, LIMIT_3);

  const isOwnProfile = user?.id === id;
  const isLoading = isAuthLoading || isProfileLoading;
  useTitle("Profile " + (profile?.name ?? "Not Found"), [profile]);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading profile...");
    } else {
      toast.dismiss();
      if (profile) {
        toast.success("Profile loaded successfully.");
      } else {
        toast.error("Failed to load profile.");
      }
    }
  }, [isLoading, profile]);

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  return (
    <div className="max-w-5xl mx-auto pb-6 px-6 space-y-6">
      <ProfileHeader
        profile={profile}
        user={user ?? undefined}
        profileId={id}
        isOwnProfile={isOwnProfile}
      />

      <WorkHistory
        work_history={profile.work_history}
        isOwnProfile={isOwnProfile}
      />

      <Skills skills={profile.skills} isOwnProfile={isOwnProfile} />

        {user && (
          <>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {posts && posts.length > 0 ? (
              <Feeds
              profile={profile}
                deletePost={deletePost}
                updatePost={updatePost}
                loading={isProfileLoading}
                posts={LIMITED_POSTS}
              />
            ) : (
              <p className="text-gray-500 text-sm text-center">No posts found</p>
            )}
          </div>
          </>
        )}
    </div>
  );
}
