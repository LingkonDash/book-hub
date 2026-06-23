'use server'

import { serverFetch } from "../core/server";

export const getBooks = async (queryString) =>{
    return serverFetch(`/books?${queryString && queryString}`);
}

//Get single book
export const getBookById = async (bookId) => {
    return serverFetch(`/books/${bookId}`);
}

// Get featured-books
export const getFeaturedBooks = async () => {
    return serverFetch('/featured-books');
}