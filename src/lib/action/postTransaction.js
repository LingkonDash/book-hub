import { serverMutation } from "../core/server"


export const postTransaction = async (paymentInfo) => {
  console.log(paymentInfo);

  // const res =  await serverMutation('/transaction', paymentInfo)

  return paymentInfo;
}