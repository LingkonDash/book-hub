import { serverMutation } from "../core/server"


export const postDelivery = async (deliveryInfo) => {

  const res =  await serverMutation('/deliveries', deliveryInfo)

  return res;
}