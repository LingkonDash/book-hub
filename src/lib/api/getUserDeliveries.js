'use server'

import { protectedServerFetch } from "../core/server";

export const getUserDeliveries = async (userId, queryString) => {

  return await protectedServerFetch(`/user/deliveries/${userId}?${queryString && queryString}`);

};