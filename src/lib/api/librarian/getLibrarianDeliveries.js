'use server'

import { protectedServerFetch } from "@/lib/core/server";


export const getLibrarianDeliveries = async (librarianId) => {

  return protectedServerFetch(`/librarian/deliveries/${librarianId}`);

};