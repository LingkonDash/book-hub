"use client";

import { handleGoogleLogin } from "@/utils/actions/formActions";
// import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  // const authClient = createAuthClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    url: '',
    password: '',
    confirmPass: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const googleButton = async () => {
    handleGoogleLogin();
    // await authClient.signIn.social({
    //   provider: "google",
    //   rememberMe: false,
    //   query: { prompt: "select_account" }
    // });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { name, email, url, password, confirmPass } = formData;

    if (!name || !email || !url || !password || !confirmPass) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    if (!hasUppercase || !hasLowercase) {
      setError('Password must contain at least one uppercase and one lowercase letter.');
      return;
    }
    if (password !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }

    // const { data, error } = await authClient.signUp.email({
    //   name,
    //   email,
    //   password,
    //   image: url,
    //   callbackURL: "/login",
    // });

    // if (error) {
    //   toast.error(error.message);
    //   return;
    // } else {
    //   setSuccess(true);
    //   router.push('/login');
    // }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen pt-24 pb-12 px-4 bg-background overflow-hidden">

      {/* Background soft glows mapped to your variables */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={onSubmit} className="relative max-w-[480px] w-full mx-auto">
        <div className="bg-surface border border-border rounded-3xl shadow-[0_8px_40px_rgba(30,58,95,0.06)] md:p-10 p-6 backdrop-blur-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary text-white rounded-2xl shadow-[0_4px_20px_rgba(30,58,95,0.25)] mb-4">
              <RiUserAddLine className="text-2xl text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h1>
            <p className="text-sm text-primary-light mt-1.5">Get started by setting up your workspace</p>
          </div>

          {/* Error and Success Status Blocks */}
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-700 p-3 rounded-xl mb-5 text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50/80 border border-green-200 text-green-700 p-3 rounded-xl mb-5 text-sm font-medium">
              Registration successful! Redirecting...
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-light/90">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 border border-border rounded-xl bg-background/50 text-foreground text-sm placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Photo URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-light/90">Photo URL</label>
              <input
                type="url"
                name="url"
                placeholder="https://your-photo-url.com"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 border border-border rounded-xl bg-background/50 text-foreground text-sm placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-light/90">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 border border-border rounded-xl bg-background/50 text-foreground text-sm placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-light/90">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 8 chars, A-Z & a-z"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-11 pl-4 pr-12 border border-border rounded-xl bg-background/50 text-foreground text-sm placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light hover:text-primary transition-colors p-1 focus:outline-none"
                >
                  {showPassword ? <FaRegEye className="text-base" /> : <FaRegEyeSlash className="text-base" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-light/90">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  name="confirmPass"
                  placeholder="Re-enter your password"
                  value={formData.confirmPass}
                  onChange={handleChange}
                  required
                  className="w-full h-11 pl-4 pr-12 border border-border rounded-xl bg-background/50 text-foreground text-sm placeholder:text-primary-light/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light hover:text-primary transition-colors p-1 focus:outline-none"
                >
                  {showConfirmPass ? <FaRegEye className="text-base" /> : <FaRegEyeSlash className="text-base" />}
                </button>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full h-12 mt-8 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl tracking-wide shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-in-out" />
            <span className="relative flex items-center justify-center gap-2">
              Create Account
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>

          {/* Login Redirection Link */}
          <p className="text-sm text-primary-light mt-5 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:text-primary-light underline-offset-4 hover:underline transition-colors duration-200">
              Login
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-primary-light font-bold uppercase tracking-widest scale-90 opacity-60">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Register SSO */}
          <button
            type="button"
            onClick={googleButton}
            className="w-full h-12 bg-background border border-border hover:border-primary text-foreground font-semibold rounded-xl shadow-sm hover:shadow-[0_4px_16px_rgba(107,174,214,0.1)] transition-all duration-300 group relative overflow-hidden flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-secondary/5 to-transparent transition-transform duration-1000 ease-in-out" />
            <FaGoogle className="text-secondary text-base transition-transform duration-300 group-hover:scale-110" />
            <span>Register with Google</span>
          </button>

        </div>
      </form>
    </div>
  );
}