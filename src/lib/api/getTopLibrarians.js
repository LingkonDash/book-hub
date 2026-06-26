'use server'

import { serverFetch } from "../core/server";

export const getTopLibrarians = async () =>{
    return serverFetch(`/top-librarians`);
}