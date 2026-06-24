"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { TiEdit } from "react-icons/ti";
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";

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

const EditBookModal = ({ book, editBook }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [form, setForm]           = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState("");
  const [loading, setLoading]     = useState(false);

  // Prefill form whenever modal opens
  useEffect(() => {
    if (isOpen && book) {
      setForm({
        title:       book.title       ?? "",
        author:      book.author      ?? "",
        description: book.description ?? "",
        category:    book.category    ?? "",
        deliveryFee: book.deliveryFee ?? "",
      });
      setPreview(book.coverImage ?? "");
      setImageFile(null);
    }
  }, [isOpen, book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (onClose) => {
    setLoading(true);
    try {
      let coverImage = book.coverImage; // keep original if not changed
      if (imageFile) {
        coverImage = await uploadToImgBB(imageFile);
      }

      const updatedBook = {
        ...form,
        deliveryFee: parseFloat(form.deliveryFee),
        coverImage,
      };

      const res = await editBook(updatedBook, book._id);

      if (res?.modifiedCount > 0) {
        toast.success("Book updated successfully!");
        onClose();
      } else {
        toast.error("No changes were saved.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button — style however fits your table/card */}
      <Button
        onPress={onOpen}
        size="sm"
        className="bg-[#fc4a32] text-white font-medium"
        startContent={<TiEdit size={16} />}
      >
        Edit
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
        size="lg"
        classNames={{
          backdrop: "bg-black/40 backdrop-blur-sm",
          base: "border border-[#fc4a32]/20",
          header: "border-b border-zinc-100 dark:border-zinc-800",
          footer: "border-t border-zinc-100 dark:border-zinc-800",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-zinc-800">
                  Edit Book
                </span>
                <span className="text-xs font-normal text-zinc-400">
                  Update the book details below
                </span>
              </ModalHeader>

              <ModalBody className="py-5 flex flex-col gap-4">
                {/* Title */}
                <Input
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  variant="bordered"
                  classNames={{ inputWrapper: "border-zinc-200 focus-within:border-[#fc4a32]" }}
                />

                {/* Author */}
                <Input
                  label="Author"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  variant="bordered"
                  classNames={{ inputWrapper: "border-zinc-200 focus-within:border-[#fc4a32]" }}
                />

                {/* Description */}
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-[#fc4a32] resize-none transition-colors"
                />

                {/* Category */}
                <Select
                  label="Category"
                  selectedKeys={form.category ? new Set([form.category]) : new Set()}
                  onSelectionChange={(keys) =>
                    setForm((prev) => ({ ...prev, category: Array.from(keys)[0] ?? "" }))
                  }
                  variant="bordered"
                  classNames={{ trigger: "border-zinc-200 data-[focus=true]:border-[#fc4a32]" }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value}>{label}</SelectItem>
                  ))}
                </Select>

                {/* Delivery Fee */}
                <Input
                  label="Delivery Fee ($)"
                  name="deliveryFee"
                  type="number"
                  value={String(form.deliveryFee)}
                  onChange={handleChange}
                  variant="bordered"
                  classNames={{ inputWrapper: "border-zinc-200 focus-within:border-[#fc4a32]" }}
                />

                {/* Cover Image */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-600">
                    Cover Image
                  </label>

                  {/* Preview */}
                  {preview && (
                    <div className="relative w-24 h-32 rounded-lg overflow-hidden border border-zinc-200">
                      <img
                        src={preview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-[#fc4a32] font-medium border border-[#fc4a32]/40 rounded-lg px-3 py-2 hover:bg-[#fc4a32]/5 transition-colors w-fit">
                    <TiEdit size={15} />
                    {imageFile ? "Change image" : "Upload new image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <span className="text-xs text-zinc-400">{imageFile.name}</span>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-zinc-500"
                  isDisabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => handleSubmit(onClose)}
                  isLoading={loading}
                  className="bg-[#fc4a32] text-white font-medium px-6"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditBookModal;