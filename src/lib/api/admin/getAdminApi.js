'use server'

import { protectedServerFetch } from "@/lib/core/server";



export const getBooks = async (queryString) =>{
    return protectedServerFetch(`admin/books?${queryString && queryString}`);
}

export const getAdminStats = async () => {
    return protectedServerFetch('/admin/stats');
}