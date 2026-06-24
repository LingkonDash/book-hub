'use server'

import { serverMutation } from "../../core/server"


export const updateDeliveryStatus = async (deliveryID, status) => {

  console.log(deliveryID, status);

  const res =  await serverMutation(`/librarian/deliveries/${deliveryID}/status`, {status: status}, 'PATCH');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  return res;
}