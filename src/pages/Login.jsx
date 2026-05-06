import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { loginUser, parseAuthResponse } from "../features/auth/authApi";

/**
 * Login component - handles user authentication
 * Provides a form for users to log in with email and password
 */
export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!form.email || !form.password) {
        throw new Error("Please fill in all fields");
      }

      const responseData = await loginUser(form.email, form.password);
      const authData = parseAuthResponse(responseData);
      dispatch(login(authData));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  return (
    <div className="grid min-h-[calc(100vh-10rem)] gap-6 px-4 py-10 sm:grid-cols-[minmax(300px,1fr)_minmax(360px,1fr)]">
      <section className="flex min-h-[360px] flex-col justify-center rounded-[1.75rem] bg-gradient-to-b from-sky-600 to-slate-950 p-8 text-slate-50 shadow-[0_22px_70px_rgba(15,23,42,0.24)]">
        <div className="max-w-xl">
          <p className="uppercase tracking-[0.24em] text-sm text-sky-200">Student access</p>
          <h2>Login to your campus workspace</h2>
          <p>
            Enter your email and password to continue to your personalized dashboard,
            courses, and announcements.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/30 bg-white/95 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.18)]">
        <h2 className="text-3xl font-semibold text-slate-900">Login</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
};