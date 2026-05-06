import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authApi";

export const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    password: "",
    
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (
      !form.name ||
      
      !form.email ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill in all required fields";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address";
    }

    if (form.phoneNumber.replace(/[^0-9]/g, "").length < 8) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      await registerUser({
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        dateOfBirth: form.dateOfBirth
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(message);
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

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => navigate("/login"), 2000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  if (success) {
    return (
      <div className="grid min-h-[calc(100vh-10rem)] gap-6 px-4 py-10 sm:grid-cols-[minmax(300px,1fr)_minmax(360px,1fr)]">
        <section className="flex min-h-[360px] flex-col justify-center rounded-[1.75rem] bg-gradient-to-b from-slate-950 via-sky-700 to-slate-600 p-8 text-slate-50 shadow-[0_22px_70px_rgba(15,23,42,0.24)]">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.24em] text-sm text-sky-200">Join the campus</p>
            <h2 className="mt-6 text-4xl font-semibold text-white">Registration complete</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">Your account is ready. Redirecting to login...</p>
          </div>
        </section>
        <section className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/30 bg-white/95 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.18)]">
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
            <h2 className="text-2xl font-semibold">Registration Successful!</h2>
            <p className="mt-3 text-sm leading-6">Redirecting to login...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-10rem)] gap-6 px-4 py-10 sm:grid-cols-[minmax(300px,1fr)_minmax(360px,1fr)]">
      <section className="flex min-h-[360px] flex-col justify-center rounded-[1.75rem] bg-gradient-to-b from-slate-950 via-sky-700 to-slate-600 p-8 text-slate-50 shadow-[0_22px_70px_rgba(15,23,42,0.24)]">
        <div className="max-w-xl">
          <p className="uppercase tracking-[0.24em] text-sm text-sky-200">New student</p>
          <h2>Register and join the learning community</h2>
          <p>Create your account to access courses and announcements.</p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/30 bg-white/95 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.18)]">
        <h2 className="text-3xl font-semibold text-slate-900">Register</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="name">
              <span>Name</span>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoFocus
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="dateOfBirth">
              <span>Date Of Birth</span>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoFocus
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="email">
            <span>Email</span>
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
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="phoneNumber">
            <span>Phone Number</span>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              placeholder="e.g. +1234567890"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="password">
              <span>Password</span>
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
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
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
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
};