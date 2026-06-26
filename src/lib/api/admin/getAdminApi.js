'use server'

import { protectedServerFetch } from "@/lib/core/server";



export const getBooks = async (queryString) =>{
    return protectedServerFetch(`admin/books?${queryString && queryString}`);
}

export const getAdminStats = async () => {
    return protectedServerFetch('/admin/stats');
}

export const getAllUsers = async () => {
    return protectedServerFetch('/admin/users');
}

export const getAllBooks = async () => {
    return protectedServerFetch('/admin/books');
}

export const getAllTransactions = async () => {
    return protectedServerFetch('/admin/transactions');
}