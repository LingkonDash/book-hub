'use server'

import { protectedServerFetch } from "../core/server";
import { getUserSession } from "../core/session";

export const getUserDeliveries = async (userId, queryString) => {

  const user = await getUserSession();
  if(!user) return {message: 'unauthorized', deliveries: [], totalDeliveries: 0}

  return await protectedServerFetch(`/user/deliveries/${userId}?${queryString && queryString}`);

};