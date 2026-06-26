'use server'

import { serverMutation } from "@/lib/core/server";



export const updateUser = async (uid, updatedUserRole) => {

  const res = await serverMutation(`/admin/users/${uid}/role`, { userRole: updatedUserRole }, 'PATCH');

  return res;
}