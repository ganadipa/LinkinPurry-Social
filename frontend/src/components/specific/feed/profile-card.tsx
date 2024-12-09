import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";
import { useProfile } from "@/hooks/profile";

const ProfileCard = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id ?? 0);

    if (!profile) {
        return null;
    }

  return (
    <Card className="overflow-hidden bg-white">
      <img src="/images/banner-placeholder.svg" alt="Cover" className="w-full h-24 object-cover" />
      
      <div className="px-4 pt-0 pb-4">
        <div className="flex justify-start">
          <Link
            href={`/profile/${user?.id}`}
            className="-mt-8 block"
          >
            <img
              src={user?.profile_photo_path}
              alt={user?.name}
              className="h-16 w-16 rounded-full border-2 border-white shadow-sm"
            />
          </Link>
        </div>

        <div className="mt-3 text-start">
          <Link
            href={`/profile/${user?.id}`}
            className="text-base font-semibold text-gray-900 hover:underline">
            {user?.name}
          </Link>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {user?.username}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user?.email}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;