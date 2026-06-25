'use server'

import { serverMutation } from "../../core/server"


export const updateDeliveryStatus = async (deliveryID, status, bookId) => {

  console.log(deliveryID, status);

  const res =  await serverMutation(`/librarian/deliveries/${deliveryID}/status`, {status: status, bookId: bookId}, 'PATCH');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  return res;
}