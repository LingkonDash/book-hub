"use client";

import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import { useRef, useState } from "react";
import { FiUploadCloud, FiX, FiBook, FiType, FiUser, FiLayers, FiDollarSign, FiAlignLeft } from "react-icons/fi";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { postLibrarianBooks } from "@/lib/action/postLibrarianBooks";

const CATEGORY_LABELS = {
  'fiction':           'Fiction',
  'sci-fi-fantasy':    'Sci-Fi & Fantasy',
  'mystery-thriller':  'Mystery & Thriller',
  'biography-history': 'Biography & History',
  'self-help':         'Self-Help',
  'business-finance':  'Business & Finance',
  'tech-science':      'Technology & Science',
  'action-adventure':  'Action & Adventure',
};

const INITIAL_FORM = {
  title: "",
  author: "",
  description: "",
  category: "",
  deliveryFee: "",
};

export default function AddBookPage() {
  const { data: session } = useSession();

  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ── Field change ──────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Image pick ────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5 MB." }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.author.trim()) e.author = "Author is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (form.description.trim().length < 30) e.description = "Description must be at least 30 characters.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.deliveryFee) e.deliveryFee = "Delivery fee is required.";
    else if (isNaN(form.deliveryFee) || Number(form.deliveryFee) <= 0) e.deliveryFee = "Enter a valid positive fee.";
    if (!imageFile) e.image = "Cover image is required.";
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setSubmitting(true);

    let imageUrl = "";
    setImageUploading(true);
    try {
      imageUrl = await uploadToImgBB(imageFile);
    } catch {
      toast.error("Cover upload failed. Please try again.");
      setErrors((prev) => ({ ...prev, image: "Image upload failed. Please try again." }));
      setSubmitting(false);
      setImageUploading(false);
      return;
    }
    setImageUploading(false);

    try {
      const res = await postLibrarianBooks({
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        category: form.category,
        coverImage: imageUrl,
        deliveryFee: Number(form.deliveryFee),
        librarianId: session?.user?.id,
        librarianEmail: session?.user?.email,
        totalDeliveries: 0,
      }, session?.user?.id);

      if (res?.insertedId || res?.acknowledged) {
        toast.success("Book submitted for approval!");
        setForm(INITIAL_FORM);
        removeImage();
        setErrors({});
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      toast.error("Failed to add book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting || imageUploading;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fad4de]/20 via-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-3xl shadow-xl shadow-slate-100/70 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Informational Sidebar Banner */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#fc4a32] to-[#fc4a32]/90 p-6 md:p-8 flex flex-col justify-between text-white text-balance">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <FiBook className="text-xl text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">Librarian Panel</p>
              <h1 className="text-2xl font-bold tracking-tight mt-1">Publish Inventory</h1>
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-light">
              Add new books directly to BookHub. Your listing values enter our curation queue instantly for catalog processing.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <FiBook className="text-xl text-white shrink-0 mt-0.5" />
            <p className="text-xs text-white/90 leading-relaxed">
              Books are placed into <span className="font-bold underline underline-offset-2">Pending</span> status until automated verification updates listing permissions.
            </p>
          </div>
        </div>

        {/* Right Form Body */}
        <form onSubmit={handleSubmit} className="md:col-span-8 p-6 sm:p-8 lg:p-10 space-y-6">
          
          {/* Cover image upload container */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Cover Image Showcase
            </label>
            {imagePreview ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isLoading}
                  className="absolute top-3 right-3 w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:bg-red-50 hover:text-red-500 transition duration-300 disabled:opacity-50"
                >
                  <FiX className="text-base" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className={`w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition duration-300 hover:border-primary hover:bg-[#fc4a32]/5 disabled:opacity-50 ${
                  errors.image ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition">
                  <FiUploadCloud className="text-xl" />
                </div>
                <p className="text-sm text-gray-500 font-semibold mt-1">Upload dynamic book cover</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP · up to 5 MB</p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && (
              <p className="text-xs font-medium text-red-500 mt-0.5">{errors.image}</p>
            )}
          </div>

          {/* Title + Author Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Book Title</label>
              <div className="relative flex items-center">
                <FiType className="absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. The Great Gatsby"
                  disabled={isLoading}
                  className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 ${
                    errors.title ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.title && <p className="text-xs font-medium text-red-500 mt-0.5">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Author Name</label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="e.g. F. Scott Fitzgerald"
                  disabled={isLoading}
                  className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 ${
                    errors.author ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.author && <p className="text-xs font-medium text-red-500 mt-0.5">{errors.author}</p>}
            </div>
          </div>

          {/* Category + Delivery Fee Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category Slot</label>
              <div className="relative flex items-center">
                <FiLayers className="absolute left-4 text-gray-400 pointer-events-none z-10" />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 bg-white appearance-none ${
                    errors.category ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
                  }`}
                >
                  <option value="">Select platform segment</option>
                  {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400 w-0 h-0" />
              </div>
              {errors.category && <p className="text-xs font-medium text-red-500 mt-0.5">{errors.category}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Delivery Fee ($)</label>
              <div className="relative flex items-center">
                <FiDollarSign className="absolute left-4 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  step="0.01"
                  name="deliveryFee"
                  value={form.deliveryFee}
                  onChange={handleChange}
                  placeholder="e.g. 3.50"
                  disabled={isLoading}
                  className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 ${
                    errors.deliveryFee ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
                  }`}
                />
              </div>
              {errors.deliveryFee && <p className="text-xs font-medium text-red-500 mt-0.5">{errors.deliveryFee}</p>}
            </div>
          </div>

          {/* Detailed Summary Fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Book Overview</label>
            <div className="relative flex items-start">
              <FiAlignLeft className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a clear, extensive index breakdown or plot description summary..."
                rows={4}
                disabled={isLoading}
                className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-300 resize-none outline-none transition focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:opacity-50 ${
                  errors.description ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
            </div>
            {errors.description && <p className="text-xs font-medium text-red-500 mt-0.5">{errors.description}</p>}
          </div>

          {/* Submission Action Trigger */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 active:scale-[0.99] transition duration-200 shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {imageUploading
                ? "Uploading cover matrix…"
                : submitting
                ? "Indexing inventory details…"
                : "Submit book for approval"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}