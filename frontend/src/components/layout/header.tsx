import { useAuth } from "@/hooks/auth";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const Header = () => {
  const [isSidenavOpen, setSidenavOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const toggleSidenav = () => setSidenavOpen((prev) => !prev);

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-16 px-4 ">
        <div className="flex items-center space-x-4">
          <Link href="/" aria-label="LinkinPurry Home">
            <img
              src="/images/linkedin.png"
              alt="LinkinPurry"
              className="w-8 h-8"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
          >
            <img src={"/images/home.png"} alt="Home" className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            href="/users"
            className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
          >
            <img
              src="/images/people.png"
              alt="Users"
              className="w-6 h-6 mb-1"
            />
            <span className="text-xs">People</span>
          </Link>
          {user === null ? (
            <>
              <Link
                href="/signin"
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/log-in.png"
                  alt="Login"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/add.png"
                  alt="Register"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/connections/${user.id}`}
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/network.png"
                  alt="Connections"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Connections</span>
              </Link>
              <Link
                href={`/requests`}
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/add.png"
                  alt="Messages"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Request</span>
              </Link>
              <Link
                href={`/chat`}
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/messaging.png"
                  alt="Messages"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Messaging</span>
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
              >
                <img
                  src="/images/account.png"
                  alt="Profile"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Profile</span>
              </Link>
              <button
                className="flex flex-col items-center text-gray-500 invert-[0.5] hover:invert-0"
                onClick={logout}
              >
                <img
                  src="/images/logout.png"
                  alt="Logout"
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs">Logout</span>
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={toggleSidenav}>
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </div>
        </button>
      </nav>

      {isSidenavOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleSidenav}
          ></div>
          <div className="fixed top-0 right-0 w-64 bg-white h-full shadow-lg p-4">
            <button
              className="text-gray-500 invert-[0.5] hover:invert-0 hover:text-gray-700 mb-4"
              onClick={toggleSidenav}
            >
              &times;
            </button>
            <Link onClick={() => setSidenavOpen(false)} href="/" className="block text-gray-700 mb-4">
              Home
            </Link>
            <Link onClick={() => setSidenavOpen(false)} href="/users" className="block text-gray-700 mb-4">
              People
            </Link>
            {user === null ? (
              <>
                <Link onClick={() => setSidenavOpen(false)} href="/signin" className="block text-gray-700 mb-4">
                  Login
                </Link>
                <Link onClick={() => setSidenavOpen(false)} href="/signup" className="block text-gray-700 mb-4">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  onClick={() => setSidenavOpen(false)}
                  href={`/connections/${user.id}`}
                  className="block text-gray-700 mb-4"
                >
                  Connections
                </Link>
                <Link onClick={() => setSidenavOpen(false)} href={`/requests`} className="block text-gray-700 mb-4">
                  Request
                </Link>
                <Link onClick={() => setSidenavOpen(false)} href={`/chat`} className="block text-gray-700 mb-4">
                  Messaging
                </Link>
                <Link
                  onClick={() => setSidenavOpen(false)}
                  href={`/profile/${user.id}`}
                  className="block text-gray-700 mb-4"
                >
                  Profile
                </Link>
                <button className="block text-gray-700 mb-4" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
