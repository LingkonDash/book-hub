'use server'

import { serverMutation } from "../../core/server"


export const adminPublishBook = async (bookId) => {

  const res =  await serverMutation(`/admin/books/${bookId}/approve`, {status: 'published'}, 'PATCH');

  return res;
}