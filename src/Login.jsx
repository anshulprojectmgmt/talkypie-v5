import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaRegEnvelope } from "react-icons/fa";
import { useAuth } from "./contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath =
    location.state?.from && location.state.from !== "/login"
      ? location.state.from
      : "/sessions";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error?.message || "Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)] md:grid-cols-2">
        <section className="relative hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Parent Console
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Monitor your child’s Talkypie sessions securely
            </h2>
            <p className="mt-4 text-sm text-indigo-100">
              Login to access private call summaries, recordings, and usage insights tied only
              to your account.
            </p>
          </div>
          <div className="space-y-3 text-sm text-indigo-100">
            <p>End-to-end account access control</p>
            <p>Session visibility restricted by user identity</p>
            <p>Fast login with persistent secure token</p>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Login to continue to your private dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <span className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <FaRegEnvelope className="text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none"
                  placeholder="parent@email.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <span className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <FaLock className="text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none"
                  placeholder="Enter password"
                />
              </span>
            </label>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            New to Talkypie?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
