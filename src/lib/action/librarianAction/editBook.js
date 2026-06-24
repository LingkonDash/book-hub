'use server'

import { serverMutation } from "../../core/server"


export const editBook = async (updatedBook, bookId,) => {


  console.log(updatedBook, bookId)
  console.log('hialsdkf')
  const res =  await serverMutation(`/books/${bookId}`, updatedBook, 'PATCH');

  const data = await res

  console.log(data);

  return res;
}