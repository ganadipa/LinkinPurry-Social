import { useAuth } from "@/hooks/auth";
import { useProfile } from "@/hooks/profile";
import Loading from "@/components/loading";
import ProfileHeader from "@/components/specific/profile/ProfileHeader";
import WorkHistory from "@/components/specific/profile/WorkHistory";
import Skills from "@/components/specific/profile/Skills";
import { useTitle } from "@/hooks/title";
import { Feeds } from "@/components/specific/profile/Feeds";

export default function ProfilePage({ id }: { id: number }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, loading: isProfileLoading, posts } = useProfile(id);

  const isOwnProfile = user?.id === id;
  const isLoading = isAuthLoading || isProfileLoading;
  useTitle("Profile " + (profile?.name ?? "Not Found"), [profile]);

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
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

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts && posts.length > 0 ? (
          <Feeds />
        ) : (
          <p className="text-gray-500 text-sm text-center">No posts found</p>
        )}
      </div>
    </div>
  );
}
