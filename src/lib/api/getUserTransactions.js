'use server'

import { protectedServerFetch } from "../core/server";

export const getUserTransactions = async (userId) => {

  return protectedServerFetch(`/user/transactions/${userId}`);

};