'use server'

import { serverMutation } from "../../core/server"


export const deleteBook = async (bookId) => {

  const res =  await serverMutation(`/books/${bookId}`, {},'DELETE')

  return res;
}