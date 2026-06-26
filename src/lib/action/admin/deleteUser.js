'use server'

import { serverMutation } from "@/lib/core/server";


export const deleteUser = async (uid) => {

  const res =  await serverMutation(`/admin/users/${uid}`, {},'DELETE')

  return res;
}