import { serverMutation } from "../core/server"


export const postTransaction = async (paymentInfo) => {

  const res =  await serverMutation('/transactions', paymentInfo)

  return res;
}