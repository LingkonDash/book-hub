'use server'

import { serverMutation } from "../../core/server"


export const unpublishBook = async (bookId) => {

  const res =  await serverMutation(`/books/${bookId}`, {status: 'unpublished'}, 'PATCH');

  return res;
}