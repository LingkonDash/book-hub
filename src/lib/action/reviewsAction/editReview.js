'use server'

import { serverMutation } from "@/lib/core/server";



export const editReview = async (updateReview, reviewId,) => {

  console.log(updateReview, reviewId);

  const res = await serverMutation(`/reviews/${reviewId}`, updateReview, 'PATCH');

  return res;
}