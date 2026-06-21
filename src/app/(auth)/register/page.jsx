"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiBookOpen } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { FiUploadCloud, FiX, FiCheck, FiUser, FiBookOpen, FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import { toast } from "react-toastify";

// ─── HELPERS ───────────────────────────────────────────────────────────────
function validatePassword(pw) {
  if (pw.length < 8) return "Must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Must contain at least one uppercase letter.";
  return null;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  // --- Form state ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Abc@1234");
  const [confirmPassword, setConfirmPassword] = useState("Abc@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [agreed, setAgreed] = useState(false);

  // --- Image state ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Error/status state ---
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  // ── Image pick ──────────────────────────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed." }));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 4 MB." }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: null }));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Inline validation ───────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match.";
    if (!agreed) errs.agreed = "You must accept the Terms & Privacy Policy.";
    // image is optional — no hard error
    return errs;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    // ── Step 1: Client-side validation ──────────────────────────────────────
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill up all fields correctly before continuing.");
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);

      // ── Step 2: Image upload (optional) ───────────────────────────────────
      let imageUrl = "";
      if (imageFile) {
        setImageUploading(true);
        try {
          imageUrl = await uploadToImgBB(imageFile);
        } catch {
          toast.error("Photo upload failed. Please try again.", { id: uploadToast });
          setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }));
          setSubmitting(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      // ── Step 3: Register via Better Auth ──────────────────────────────────

      const { data, error } = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        role,
        image: imageUrl || "",
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        setServerError(error.message || "Registration failed. Please try again.");
        return;
      }

      // ── Step 4: Success → role-based redirect ─────────────────────────────
      toast.success("Account created! Redirecting you to your dashboard…");
      setSuccessMsg("Account created! Redirecting…");

      // Small delay so the success toast is visible before navigation
      setTimeout(() => {
        router.push('/');
      }, 1200);

    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }


  // ── Google signup ────────────────────────────────────────────────────────
  async function handleGoogleSignUp() {
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard/user" });
  }

  // ── Password strength indicator ──────────────────────────────────────────
  const pwStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][pwStrength];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-white rounded-[40px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: Form ─────────────────────────────────────────────────── */}
        <div className="p-8 md:p-14 order-2 flex items-start lg:items-center overflow-y-auto max-h-screen lg:max-h-none">
          <div className="w-full max-w-lg mx-auto py-4">

            {/* Mobile logo */}
            <Link href="/" className="flex lg:hidden items-center gap-2 text-black mb-10">
              <BiBookOpen size={42} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold">BookHub</h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-black tracking-tight">Create Account</h2>
            <p className="mt-3 text-gray-500 leading-7">
              Join BookHub and start exploring literary classics, academic resources, and new titles delivered straight to your door.
            </p>

            {/* Server-level feedback */}
            {serverError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-medium">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2">
                <FiCheck /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">

              {/* ── Full Name ── */}
              <div>
                <label className="text-sm font-semibold text-black">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-black
                    ${errors.fullName
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#fc4a32] focus:ring-[#fad4de]"
                    }`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* ── Email ── */}
              <div>
                <label className="text-sm font-semibold text-black">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full mt-2 border rounded-xl px-5 py-4 outline-none focus:ring-2 transition bg-white text-black
                    ${errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#fc4a32] focus:ring-[#fad4de]"
                    }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* ── Password ── */}
              <div>
                <label className="text-sm font-semibold text-black">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your password"
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

                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: i <= pwStrength ? strengthColor : "#e5e7eb" }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1 font-medium" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </p>
                  </div>
                )}

                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                <p className="mt-1 text-xs text-gray-400">Min. 8 characters with at least one uppercase letter.</p>
              </div>

              {/* ── Confirm Password ── */}
              <div>
                <label className="text-sm font-semibold text-black">Confirm Password</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full border rounded-xl px-5 py-4 pr-12 outline-none focus:ring-2 transition bg-white text-black
                      ${errors.confirmPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : confirmPassword && confirmPassword === password
                          ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                          : "border-gray-300 focus:border-[#fc4a32] focus:ring-[#fad4de]"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
                {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
                  <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                    <FiCheck size={11} /> Passwords match
                  </p>
                )}
              </div>

              {/* ── Role Select ─────────────────────────────────────────────── */}
              <div>
                <label className="text-sm font-semibold text-black">Account Role</label>
                <p className="text-xs text-gray-400 mt-0.5">Choose what describes you best.</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { value: "user", label: "Reader", icon: FiUser, desc: "Browse & borrow books" },
                    { value: "librarian", label: "Librarian", icon: FiBookOpen, desc: "Manage catalog & deliveries" },
                  ].map(({ value, label, icon: Icon, desc }) => (
                    <label
                      key={value}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                        ${role === value
                          ? "border-[#fc4a32] bg-[#fff5f4] shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={role === value}
                        onChange={() => setRole(value)}
                        className="sr-only"
                      />
                      {/* Check badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                          ${role === value ? "border-[#fc4a32] bg-[#fc4a32]" : "border-gray-300"}`}
                      >
                        {role === value && <FiCheck size={10} className="text-white stroke-[3]" />}
                      </span>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition
                        ${role === value ? "bg-[#fc4a32] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className={`text-sm font-semibold ${role === value ? "text-[#fc4a32]" : "text-gray-700"}`}>
                        {label}
                      </span>
                      <span className="text-[11px] text-gray-400 text-center leading-4">{desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Profile Image Upload ─────────────────────────────────────── */}
              <div>
                <label className="text-sm font-semibold text-black">Profile Photo</label>
                <p className="text-xs text-gray-400 mt-0.5">Optional — max 4 MB. JPG, PNG, or WebP.</p>

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-3 border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200
                      ${errors.image ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-[#fc4a32] hover:bg-[#fff5f4]"}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <FiUploadCloud size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Click to upload a photo</p>
                      <p className="text-xs text-gray-400 mt-0.5">or drag and drop here</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                      JPG · PNG · WebP · up to 4 MB
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-4 border border-gray-200 rounded-2xl p-4 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{imageFile?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {(imageFile?.size / 1024).toFixed(1)} KB
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-xs text-green-600 font-medium">Ready to upload</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition flex-shrink-0"
                      aria-label="Remove image"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
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
                          : errors.agreed ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                        }`}
                    >
                      {agreed && <FiCheck size={11} className="text-white stroke-[3]" />}
                    </div>
                  </div>
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-5 cursor-pointer" onClick={() => setAgreed((v) => !v)}>
                    I agree to the BookHub{" "}
                    <Link href="/terms" className="text-[#fc4a32] hover:underline font-medium">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-[#fc4a32] hover:underline font-medium">Privacy Policy</Link>
                  </label>
                </div>
                {errors.agreed && <p className="mt-1 text-xs text-red-500 pl-8">{errors.agreed}</p>}
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
                    {imageUploading ? "Uploading photo…" : "Creating account…"}
                  </>
                ) : (
                  "Create Account"
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
              onClick={handleGoogleSignUp}
              className="w-full border border-[#fc4a32] rounded-xl hover:bg-[#fff5f4] py-4 px-5 flex items-center justify-center gap-3 text-[#fc4a32] transition duration-300 cursor-pointer font-medium"
            >
              <BsGoogle size={20} />
              Sign up with Google
            </button>

            <p className="mt-7 text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#fc4a32] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: Branding ───────────────────────────────────────────────── */}
        <div className="hidden order-1 lg:flex relative bg-black p-10 md:p-14 flex-col justify-between min-h-[500px]">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop"
              alt="BookHub Library Showcase"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-white">
              <BiBookOpen size={48} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold tracking-tight">BookHub</h2>
            </Link>

            <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Discover amazing reading experiences from top inventories
            </h1>

            <p className="mt-6 text-gray-300 leading-7 max-w-md text-base">
              Create your account and unlock personalized reading recommendations, verified local library archives, and fast home delivery options.
            </p>
          </div>

          {/* Role preview cards */}
          <div className="relative z-10 mt-10 space-y-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
              <p className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fc4a32]" />
                Doorstep Delivery · Certified Libraries · Instant Lending
              </p>
              <p className="mt-2 text-gray-300 text-sm leading-6">
                Enjoy physical books, simple item processing with secure checkout options, and a flawless decentralized catalog experience every single day.
              </p>
            </div>

            {/* Two role hint pills */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#fc4a32]/80 flex items-center justify-center">
                  <FiUser size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Readers</p>
                  <p className="text-gray-400 text-[11px]">Browse & borrow</p>
                </div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#fc4a32]/80 flex items-center justify-center">
                  <FiBookOpen size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Librarians</p>
                  <p className="text-gray-400 text-[11px]">Manage catalog</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}