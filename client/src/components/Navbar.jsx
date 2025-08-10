import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdown(false);
    setMobileMenu(false);
  };

  // Nav links (center)
  const navLinks = (
    <>
      <Link
        to="/"
        className="block px-4 py-2 text-sm hover:text-blue-600"
        onClick={() => setMobileMenu(false)}
      >
        Explore
      </Link>
      <Link
        to="/about"
        className="block px-4 py-2 text-sm hover:text-blue-600"
        onClick={() => setMobileMenu(false)}
      >
        About
      </Link>
      <Link
        to="/contact"
        className="block px-4 py-2 text-sm hover:text-blue-600"
        onClick={() => setMobileMenu(false)}
      >
        Contact
      </Link>
      {user && (
        <Link
          to="/my-bookings"
          className="block px-4 py-2 text-sm hover:text-blue-600"
          onClick={() => setMobileMenu(false)}
        >
          My Bookings
        </Link>
      )}

      {user?.role === "user" && (
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm hover:text-blue-600"
          onClick={() => setMobileMenu(false)}
        >
          Become a Host
        </Link>
      )}
    </>
  );

  // Profile dropdown
  const profileDropdown = (
    <div className="absolute right-0 top-12 bg-white shadow rounded w-44 py-2 z-50">
      <Link
        to="/profile"
        className="block px-4 py-2 hover:bg-gray-100 text-sm"
        onClick={() => {
          setDropdown(false);
          setMobileMenu(false);
        }}
      >
        Profile
      </Link>
      {user && (
        <Link
          to="/inbox"
          className="block px-4 py-2 text-sm hover:text-blue-600"
          onClick={() => setMobileMenu(false)}
        >
          Inbox
        </Link>
      )}

      {user?.role === "host" && (
        <Link
          to="/host/dashboard"
          className="block px-4 py-2 hover:bg-gray-100 text-sm"
          onClick={() => {
            setDropdown(false);
            setMobileMenu(false);
          }}
        >
          Host Dashboard
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
      >
        Logout
      </button>
    </div>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 tracking-tight"
          >
            StayFinder
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">{navLinks}</div>

          {/* Right Side */}
          <div className="relative flex items-center gap-4">
            {user ? (
              <>
                <button
                  className="rounded-full w-9 h-9 bg-gray-200 flex items-center justify-center text-lg border"
                  onClick={() => setDropdown((d) => !d)}
                >
                  {user.name?.[0]?.toUpperCase() || "👤"}
                </button>
                {dropdown && profileDropdown}
              </>
            ) : (
              <button
                onClick={() => navigate("/authpage")}
                className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
              >
                Login / Register
              </button>
            )}
            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10"
              onClick={() => setMobileMenu((m) => !m)}
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow border-t">
          <div className="flex flex-col py-2">
            {navLinks}
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                  onClick={() => setDropdown((d) => !d)}
                >
                  <span className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center text-lg border">
                    {user.name?.[0]?.toUpperCase() || "👤"}
                  </span>
                  <span>Account</span>
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdown && profileDropdown}
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/authpage");
                  setMobileMenu(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 m-2 rounded font-medium"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
