'use server'

import { protectedServerFetch } from "@/lib/core/server";


export const getLibrarianBooks = async (librarianId) => {

  return protectedServerFetch(`/librarian/books/${librarianId}`);

};