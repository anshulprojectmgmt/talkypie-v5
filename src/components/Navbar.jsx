import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaMicrophoneAlt, FaBars, FaTimes, FaRegUserCircle } from "react-icons/fa";
import { MdDashboard, MdMonitor, MdSettings } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

function navLinkClass(isActive) {
  return [
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-indigo-600 text-white shadow-md"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = useMemo(
    () => location.pathname === "/login" || location.pathname === "/signup",
    [location.pathname],
  );

  const showBottomNav = isAuthenticated && !isAuthPage;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-md">
              <FaMicrophoneAlt className="text-base" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight text-slate-900">Talkypies</p>
              <p className="text-xs text-slate-500">AI Voice Companion</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/start"
                  className={({ isActive }) => navLinkClass(isActive)}
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.assign("/start");
                  }}
                >
                  <MdDashboard className="text-lg" />
                  Parent App
                </NavLink>
                <NavLink to="/sessions" className={({ isActive }) => navLinkClass(isActive)}>
                  <MdMonitor className="text-lg" />
                  Monitor Sessions
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => navLinkClass(isActive)}>
                  <MdSettings className="text-lg" />
                  Settings
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <FaRegUserCircle className="text-slate-500" />
                  <span className="max-w-[220px] truncate text-sm text-slate-700">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-xl border border-slate-300 p-2 text-slate-700 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-900">Menu</p>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-slate-300 p-2 text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/start"
                    className={({ isActive }) => navLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MdDashboard className="text-lg" />
                    Parent App
                  </NavLink>
                  <NavLink
                    to="/sessions"
                    className={({ isActive }) => navLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MdMonitor className="text-lg" />
                    Monitor Sessions
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => navLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MdSettings className="text-lg" />
                    Settings
                  </NavLink>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {user?.email}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => navLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) => navLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showBottomNav ? (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
          <div className="grid grid-cols-3 gap-1 px-2 py-1">
            <NavLink
              to="/start"
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-2 py-2 text-xs font-medium ${
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
                }`
              }
            >
              <MdDashboard className="text-xl" />
              Parent
            </NavLink>
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-2 py-2 text-xs font-medium ${
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
                }`
              }
            >
              <MdMonitor className="text-xl" />
              Sessions
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-2 py-2 text-xs font-medium ${
                  isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
                }`
              }
            >
              <MdSettings className="text-xl" />
              Settings
            </NavLink>
          </div>
        </nav>
      ) : null}
    </>
  );
}
