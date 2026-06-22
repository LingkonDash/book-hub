'use server'

import { serverFetch } from "../core/server";

export const getBooks = async (queryString) =>{
    return serverFetch(`/books?${queryString && queryString}`);
}

// Get single book
export const getBookById = async (jobId) => {
    return serverFetch(`/books/${jobId}`);
}
