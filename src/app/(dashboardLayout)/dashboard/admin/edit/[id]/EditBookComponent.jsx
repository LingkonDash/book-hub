"use client";

import { useEffect, useRef, useState } from "react";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";
import { toast } from "react-toastify";
import { editBook } from "@/lib/action/librarianAction/editBook";
import { FiUploadCloud, FiX, FiSave, FiImage } from "react-icons/fi";
import { useRouter } from "next/navigation";

const CATEGORY_LABELS = {
  fiction:             "Fiction",
  "sci-fi-fantasy":    "Sci-Fi & Fantasy",
  "mystery-thriller":  "Mystery & Thriller",
  "biography-history": "Biography & History",
  "self-help":         "Self-Help",
  "business-finance":  "Business & Finance",
  "tech-science":      "Technology & Science",
  "action-adventure":  "Action & Adventure",
};

const EditBookComponent = ({ book }) => {

  const router = useRouter();

  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle]           = useState("");
  const [author, setAuthor]         = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  // ✅ Fix: initialize from prop ONCE, no infinite re-render
  useEffect(() => {
    if (!book) return;
    setTitle(book.title ?? "");
    setAuthor(book.author ?? "");
    setDescription(book.description ?? "");
    setCategory(book.category ?? "");
    setDeliveryFee(book.deliveryFee ?? "");
    setOriginalImage(book.coverImage ?? "");
    setImagePreview(book.coverImage ?? "");
  }, [book]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(originalImage);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let coverImage = originalImage;
      if (imageFile) {
        const uploaded = await uploadToImgBB(imageFile);
        if (!uploaded) throw new Error("Image upload failed.");
        coverImage = uploaded;
      }

      const updatedBook = {
        title,
        author,
        description,
        category,
        deliveryFee: parseFloat(deliveryFee),
        coverImage,
      };

      const res = await editBook(updatedBook, book._id);

      if (res?.modifiedCount > 0) {
        toast.success("Book updated successfully!");
        router.push('/dashboard/admin/manage-books');
      } else {
        toast.info("No changes were saved.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 pb-20 font-sans">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-7">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#fc4a32]">
          Library Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-1 tracking-tight">
          Edit Book
        </h1>
        <p className="text-sm text-gray-500">
          Update the details below and save your changes.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6"
      >
        {/* ── Cover Image ── */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-800">Cover Image</label>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Preview */}
            <div className="w-24 h-36 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiImage className="text-gray-400 text-2xl" />
              )}
            </div>

            {/* Upload controls */}
            <div className="flex flex-col gap-2 justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="coverInput"
              />
              <label
                htmlFor="coverInput"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#fc4a32] hover:bg-[#e03e28] text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors w-fit"
              >
                <FiUploadCloud className="text-base" />
                {imageFile ? "Change image" : "Upload new image"}
              </label>

              {imageFile ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {imageFile.name}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 text-xs text-[#fc4a32] hover:underline"
                  >
                    <FiX className="text-sm" /> Remove
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400">JPG, PNG or WEBP · max 5 MB</p>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Title ── */}
        <Field label="Title">
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Book title"
          />
        </Field>

        {/* ── Author ── */}
        <Field label="Author">
          <input
            className={inputCls}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="Author name"
          />
        </Field>

        {/* ── Category ── */}
        <Field label="Category">
          <select
            className={inputCls + " cursor-pointer"}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {Object.entries(CATEGORY_LABELS).map(([val, lbl]) => (
              <option key={val} value={val}>{lbl}</option>
            ))}
          </select>
        </Field>

        {/* ── Delivery Fee ── */}
        <Field label="Delivery Fee ($)">
          <input
            className={inputCls}
            type="number"
            min="0"
            step="0.01"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            required
            placeholder="0.00"
          />
        </Field>

        {/* ── Description ── */}
        <Field label="Description">
          <textarea
            className={inputCls + " resize-y min-h-[110px] leading-relaxed"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="A short description of the book…"
          />
        </Field>

        {/* ── Submit ── */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#fc4a32] hover:bg-[#e03e28] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <FiSave className="text-base" />
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

const inputCls =
  "w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg outline-none transition focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fc4a32]/10";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-800">{label}</label>
    {children}
  </div>
);

export default EditBookComponent;