"use client";

import { deleteBook } from "@/lib/action/librarianAction/deleteBook";
import { AlertDialog, Button } from "@heroui/react";
import { TiTrash } from "react-icons/ti";
import { toast } from "react-toastify";

export function DeleteBookModal({ book, onActionComplete }) {

  const handleDelete = async () => {

    try {
      const res = await deleteBook(book._id)
      if (res.deletedCount > 0) toast.success('Book deleted.')
      else toast.error('Failed to delete. Try again!')
      onActionComplete()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <AlertDialog>
      <Button
        className="w-full bg-transparent text-[14px] rounded-none flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <TiTrash className="w-4 h-4" />
        Delete book
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete Book permanently?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Are you sure you want to delete <strong>{book.title}</strong>? This cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button onClick={handleDelete} slot="close" variant="danger">
                Delete Book
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}