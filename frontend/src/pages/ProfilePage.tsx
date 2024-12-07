import { useAuth } from "@/hooks/auth";
import { useProfile } from "@/hooks/profile";
import Loading from "@/components/loading";
import ProfileHeader from "@/components/specific/profile/ProfileHeader";
import WorkHistory from "@/components/specific/profile/WorkHistory";
import Skills from "@/components/specific/profile/Skills";

export default function ProfilePage({ id }: { id: number }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, loading: isProfileLoading } = useProfile(id);

  const isOwnProfile = user?.id === id;
  const isLoading = isAuthLoading || isProfileLoading;

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
    </div>
  );
}
