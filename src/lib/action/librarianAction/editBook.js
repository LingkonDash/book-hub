'use server'

import { serverMutation } from "../../core/server"


export const editBook = async (updatedBook, bookId,) => {

  const res =  await serverMutation(`/books/${bookId}`, updatedBook, 'PATCH');

  return res;
}