
import { protectedServerFetch } from "../core/server";
import { getUserSession } from "../core/session";

export const getUserReviews = async () => {

  const user = await getUserSession()

  return protectedServerFetch(`/user/reviews/${user?.id}`);
};