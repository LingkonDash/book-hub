'use server'

import { serverFetch } from "../core/server";

export const getBooks = async (queryString) =>{
    return serverFetch(`/books?${queryString && queryString}`);
}