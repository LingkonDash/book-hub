'use server'

import { protectedServerFetch } from "../core/server";

export const getUserDeliveries = async (queryString) => {

  return protectedServerFetch(`/books?${queryString && queryString}`);

};