import { serverFetch } from "../core/server";

export const getReviews = async (bookId) => {
  return serverFetch(`/reviews/${bookId}`);
};