import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { useAuth } from "./contexts/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectPath =
    location.state?.from && location.state.from !== "/signup"
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and confirm password do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error?.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)] md:grid-cols-2">
        <section className="relative hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Account Setup
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Create a secure parent account in under a minute
            </h2>
            <p className="mt-4 text-sm text-indigo-100">
              Your account controls access to monitor sessions, recordings, and child activity.
            </p>
          </div>
          <div className="space-y-3 text-sm text-indigo-100">
            <p>Private monitor dashboard</p>
            <p>User-level session ownership enforcement</p>
            <p>Secure token-based authentication</p>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign up to monitor your own Talkypie sessions.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
              <span className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <FaRegUser className="text-slate-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none"
                  placeholder="Parent name"
                />
              </span>
            </label>

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
                  placeholder="Minimum 8 chars"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Confirm Password
              </span>
              <span className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <FaLock className="text-slate-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none"
                  placeholder="Re-enter password"
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
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
