import { useAuth } from "@/hooks/auth";
import { useState } from "react";

const Header = () => {
  const [isSidenavOpen, setSidenavOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidenav = () => setSidenavOpen((prev) => !prev);

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-14 px-4">
        <div className="flex items-center space-x-4">
          <a href="/" aria-label="LinkedIn Home">
            <img
              src="/public/images/linkedin.png"
              alt="LinkedIn"
              className="w-8 h-8"
            />
          </a>
          <form className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
            <img
              src="/public/images/search.png"
              alt="Search Icon"
              className="w-4 h-4 mr-2 invert-[0.5]"
            />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none text-sm w-64"
            />
          </form>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="flex flex-col items-center text-gray-500">
            <img
              src="/public/images/home.png"
              alt="Home"
              className="w-6 h-6 mb-1 invert-[0.5]"
            />
            <span className="text-xs">Home</span>
          </a>
          {user === null ? (
            <>
              <a
                href="/signin"
                className="flex flex-col items-center text-gray-500"
              >
                <img
                  src="/public/images/log-in.png"
                  alt="Login"
                  className="w-6 h-6 mb-1 invert-[0.5]"
                />
                <span className="text-xs">Login</span>
              </a>
              <a
                href="/signup"
                className="flex flex-col items-center text-gray-500"
              >
                <img
                  src="/public/images/add.png"
                  alt="Register"
                  className="w-6 h-6 mb-1 invert-[0.5]"
                />
                <span className="text-xs">Register</span>
              </a>
            </>
          ) : (
            <>
              {/* {user.role.value === "jobseeker" && (
                <a href="/jobseeker/history" className="flex flex-col items-center text-gray-500">
                  <img src="/public/images/history.png" alt="History" className="w-6 h-6 mb-1 invert-[0.5]" />
                  <span className="text-xs">History</span>
                </a>
              )}
              {user.role.value === "company" && (
                <a href="/profile" className="flex flex-col items-center text-gray-500">
                  <img src="/public/images/account.png" alt="Profile" className="w-6 h-6 mb-1 invert-[0.5]" />
                  <span className="text-xs">Profile</span>
                </a>
              )}
              // */}
              <button
                className="flex flex-col items-center text-gray-500"
                onClick={logout}
              >
                <img
                  src="/public/images/logout.png"
                  alt="Logout"
                  className="w-6 h-6 mb-1 invert-[0.5]"
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
              className="text-gray-500 hover:text-gray-700 mb-4"
              onClick={toggleSidenav}
            >
              &times;
            </button>
            <a href="/" className="block text-gray-700 mb-4">
              Home
            </a>
            {user === null ? (
              <>
                <a href="/signin" className="block text-gray-700 mb-4">
                  Login
                </a>
                <a href="/signup" className="block text-gray-700 mb-4">
                  Register
                </a>
              </>
            ) : (
              <>
                {/* {user.role.value === "jobseeker" && (
                  <a
                    href="/jobseeker/history"
                    className="block text-gray-700 mb-4"
                  >
                    History
                  </a>
                )}
                {user.role.value === "company" && (
                  <a href="/profile" className="block text-gray-700 mb-4">
                    Profile
                  </a>
                )} */}
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
