
import { getUserReviews } from '@/lib/api/getUserReviews';
import MyReviewsClient from './MyReviewsClient';

const MyReviewsPage = async () => {
  const userReviews = await getUserReviews();
  const reviews = userReviews?.reviews ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 pl-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Reviews</h1>
        <p className="text-sm text-slate-400 mt-1">Manage all the reviews you have left on books</p>
      </div>
      <MyReviewsClient reviews={reviews} />
    </div>
  );
};

export default MyReviewsPage;