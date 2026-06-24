'use server'

import { getUserSession } from "@/lib/core/session";
import { serverMutation } from "../../core/server"
import { getBookById } from "@/lib/api/getBooks";


export const unpublishBook = async (bookId) => {

  const user = await getUserSession();

  console.log(user);

   const book = await getBookById(bookId)
  console.log(book);

  // const res =  await serverMutation(`/books/${bookId}`, {status: 'unpublished'}, 'PATCH');

  return //res;
}