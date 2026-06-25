import { serverMutation } from "@/lib/core/server";


export const postReview = async (reviewInfo) => {

  const res =  await serverMutation('/reviews', reviewInfo, 'POST')

  console.log(await res);

  return res;
}