'use server'

import { protectedServerFetch } from "@/lib/core/server";


export const getLibrarianBooks = async (librarianId, query) => {

  return protectedServerFetch(`/librarian/books/${librarianId}${query && `?${query}`}`);

};