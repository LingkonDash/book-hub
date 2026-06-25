'use server'

import { serverMutation } from "@/lib/core/server";




export const deleteReview = async (reviewId) => {

  const res =  await serverMutation(`/reviews/${reviewId}`, {},'DELETE')

  return res;
}