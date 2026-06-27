import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import AuthLayout, { AuthLink } from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsGuest, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout
      standalone
      title="Welcome Back"
      subtitle="Log in to order from BHANDU KHAN"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <AuthLink to="/signup">Sign Up</AuthLink>
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
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy">
            Email
          </label>
          <div className="relative">
            <IoMailOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-[48px] w-full rounded-xl border border-gray-border bg-gray-input pl-10 pr-4 text-sm text-navy outline-none transition focus:border-orange/40 focus:bg-white focus:ring-2 focus:ring-orange/15"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy">
            Password
          </label>
          <div className="relative">
            <IoLockClosedOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="h-[48px] w-full rounded-xl border border-gray-border bg-gray-input pl-10 pr-11 text-sm text-navy outline-none transition focus:border-orange/40 focus:bg-white focus:ring-2 focus:ring-orange/15"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted hover:text-navy"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? (
                <IoEyeOffOutline className="h-[18px] w-[18px]" />
              ) : (
                <IoEyeOutline className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full items-center justify-center rounded-xl bg-orange text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-muted">
        By logging in you agree to our terms &amp; privacy policy.
      </p>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-border" />
        </div>
        <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium text-gray-muted">
          or
        </p>
      </div>

      <button
        type="button"
        onClick={handleGuestLogin}
        className="flex h-[50px] w-full items-center justify-center rounded-xl border-2 border-navy/15 bg-white text-[15px] font-bold text-navy transition hover:border-orange/40 hover:bg-orange-light hover:text-orange"
      >
        Continue as Guest
      </button>
    </AuthLayout>
  );
}

export default Login;
