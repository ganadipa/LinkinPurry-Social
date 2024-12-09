import { Card } from "@/components/ui/card";
import { useConnectionRecommendation } from "@/hooks/connection-recommendations";
import { Link } from "@tanstack/react-router";

interface RecommendedUser {
  id: number;
  username: string;
  name: string;
  profile_photo_path: string;
  email: string;
}

const Recommendations = () => {
  const { users: recommendations } = useConnectionRecommendation();

  return (
    <Card className="p-4 lg:sticky lg:top-20 bg-white">
      <h2 className="font-semibold text-gray-900 mb-4">People you may know</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {recommendations.map((user: RecommendedUser) => (
          <div 
            key={user.id} 
            className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Link
              to="/profile/$id"
              params={{ id: user.id.toString() }}
              className="flex-shrink-0"
            >
              <img
                src={user.profile_photo_path}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to="/profile/$id"
                params={{ id: user.id.toString() }}
                className="font-medium text-gray-900 hover:underline truncate block"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-500 truncate mb-2">
                @{user.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Recommendations;