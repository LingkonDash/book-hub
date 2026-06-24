'use server'

import { serverMutation } from "../../core/server"


export const publishBook = async (bookId) => {

  const res =  await serverMutation(`/books/${bookId}`, {status: 'pending'}, 'PATCH');

  return res;
}