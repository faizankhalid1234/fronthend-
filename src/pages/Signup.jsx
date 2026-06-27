import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCallOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { AuthLink } from "../components/AuthLayout";

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirm } = form;

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, phone, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-[48px] w-full rounded-xl border border-gray-border bg-gray-input pl-10 pr-4 text-sm text-navy outline-none transition focus:border-orange/40 focus:bg-white focus:ring-2 focus:ring-orange/15";

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to order from BHANDU KHAN"
      footer={
        <>
          Already have an account?{" "}
          <AuthLink to="/login">Log In</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy">
            Full Name
          </label>
          <div className="relative">
            <IoPersonOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-navy">
            Email
          </label>
          <div className="relative">
            <IoMailOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy">
            Phone Number
          </label>
          <div className="relative">
            <IoCallOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="+966 5X XXX XXXX"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-navy">
            Password
          </label>
          <div className="relative">
            <IoLockClosedOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="signup-password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={update("password")}
              placeholder="Min. 6 characters"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted hover:text-navy"
            >
              {showPass ? (
                <IoEyeOffOutline className="h-[18px] w-[18px]" />
              ) : (
                <IoEyeOutline className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-navy">
            Confirm Password
          </label>
          <div className="relative">
            <IoLockClosedOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="confirm"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirm}
              onChange={update("confirm")}
              placeholder="Repeat password"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full items-center justify-center rounded-xl bg-orange text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
