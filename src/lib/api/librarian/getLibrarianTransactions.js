'use server'

import { protectedServerFetch } from "@/lib/core/server";


export const getLibrarianTransactions = async (librarianId) => {

  return protectedServerFetch(`/librarian/transactions/${librarianId}`);

};