"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiBookOpen } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  // --- Form state ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Abc@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // --- Error / submit state ---
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!agreed) errs.agreed = "You must accept the Terms & Privacy Policy.";
    return errs;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    // Step 1: Validate
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please checkout all inputs before continuing.");
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);

      // Step 2: Sign in via Better Auth
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please check your credentials.");
        setErrors({ server: error.message || "Invalid email or password." });
        return;
      }

      console.log(data);

      // Step 3: Role-based redirect
      const userRole = data?.user?.userRole || "user";
      
      let destination = "/";

      if (userRole === "librarian") {
        destination = "/dashboard/librarian";
      } else if (userRole === "admin") {
        destination = "/dashboard/admin";
      }

      if(userRole === 'user') toast.success(`Welcome back! Redirecting to Home.`);
      else toast.success(`Welcome back! Redirecting to your dashboard.`);

      setTimeout(() => {
        router.push(destination);
      }, 1500);

    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setErrors({ server: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Google sign-in ───────────────────────────────────────────────────────
  async function handleGoogleSignIn() {
    const googleToast = toast.loading("Connecting to Google…");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      toast.success("Redirecting…", { id: googleToast });
    } catch {
      toast.error("Google sign-in failed. Please try again.", { id: googleToast });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-white rounded-[40px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: Branding ───────────────────────────────────────────────── */}
        <div className="hidden lg:flex relative bg-black p-10 md:p-14 flex-col justify-between min-h-[500px]">

          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop"
              alt="BookHub Library"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-white">
              <BiBookOpen size={48} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold tracking-tight">BookHub</h2>
            </Link>

            <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your favorite books delivered straight to your doorstep
            </h1>

            <p className="mt-6 text-gray-300 leading-7 max-w-md text-base">
              Explore diverse global collections, connect with local library inventories,
              and enjoy seamless secure door-to-door deliveries powered by Stripe.
            </p>
          </div>

          <div className="relative z-10 mt-10 space-y-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
              <p className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fc4a32]" />
                Doorstep Delivery · Verified Reviews · Secure Checkout
              </p>
              <p className="mt-2 text-gray-300 text-sm leading-6">
                Join our decentralized reading ecosystem. Instantly rent or request book
                deliveries from certified independent library owners and curators.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-white text-xl font-extrabold">12K+</p>
                <p className="text-gray-400 text-[11px] mt-0.5">Active Readers</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-white text-xl font-extrabold">4.9★</p>
                <p className="text-gray-400 text-[11px] mt-0.5">Avg. Rating</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-white text-xl font-extrabold">800+</p>
                <p className="text-gray-400 text-[11px] mt-0.5">Libraries</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Login Form ─────────────────────────────────────────────── */}
        <div className="p-8 md:p-14 flex items-center">
          <div className="w-full max-w-lg mx-auto">

            {/* Mobile logo */}
            <Link href="/" className="flex lg:hidden items-center gap-2 text-black mb-10">
              <BiBookOpen size={42} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold">BookHub</h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-black tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-3 text-gray-500 leading-7">
              Login to access your dashboard, track delivery orders, or manage inventories.
            </p>

            {/* Server-level error */}
            {errors.server && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium">
                {errors.server}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

              {/* ── Email ── */}
              <div>
                <label className="text-sm font-semibold text-black">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-black
                    ${errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#fc4a32] focus:ring-[#fad4de]"
                    }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* ── Password ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-black">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-500 hover:text-[#fc4a32] hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full border rounded-xl px-5 py-4 pr-12 outline-none focus:ring-2 transition bg-white text-black
                      ${errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-[#fc4a32] focus:ring-[#fad4de]"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* ── Terms checkbox ── */}
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => setAgreed((v) => !v)}
                      className={`w-5 h-5 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all
                        ${agreed
                          ? "bg-[#fc4a32] border-[#fc4a32]"
                          : errors.agreed
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                    >
                      {agreed && <FiCheck size={11} className="text-white stroke-[3]" />}
                    </div>
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-5 cursor-pointer"
                    onClick={() => setAgreed((v) => !v)}
                  >
                    I agree to the BookHub{" "}
                    <Link href="/terms" className="text-[#fc4a32] hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#fc4a32] hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreed && (
                  <p className="mt-1 text-xs text-red-500 pl-8">{errors.agreed}</p>
                )}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#fc4a32] hover:bg-[#e03e28] disabled:bg-[#fca899] text-white py-4 rounded-xl font-semibold transition duration-300 cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="my-7 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ── Google ── */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full border border-[#fc4a32] rounded-xl hover:bg-[#fff5f4] py-4 px-5 flex items-center justify-center gap-3 text-[#fc4a32] transition duration-300 cursor-pointer font-medium"
            >
              <BsGoogle size={20} />
              Sign in with Google
            </button>

            <p className="mt-7 text-center text-gray-500">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="text-[#fc4a32] font-semibold hover:underline transition"
              >
                Register Now
              </Link>
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}