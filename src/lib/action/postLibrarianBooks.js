'use server'

import { serverMutation } from "../core/server"


export const postLibrarianBooks = async (book, id) => {

  const res =  await serverMutation(`/librarian/books/${id}`, book)

  return res;
}