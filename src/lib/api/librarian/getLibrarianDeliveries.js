'use server'

import { protectedServerFetch } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";


export const getLibrarianDeliveries = async () => {
  
  const user = getUserSession();

  return protectedServerFetch(`/librarian/deliveries/${user.id}`);

};