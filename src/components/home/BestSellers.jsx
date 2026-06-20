import React from 'react';
// import { getAllBooks } from '@/actions/books'; // Adjust this path to your folder structures
import BestSellersCarousel from './BestSellersCarousel';
import { getAllBooks } from '@/utils/actions/server/getAllBooks';

const BestSellers = async () => {
  let books = [];
  try {
    // Calling your server action helper function
    books = await getAllBooks("");
  } catch (error) {
    console.error("Failed to fetch best sellers on server side:", error);
  }

  // Filter out top tier books to populate best seller shelf
  const bestSellersData = Array.isArray(books) 
    ? books.filter(book => book.rating?.average >= 4.0).slice(0, 12)
    : [];

  return (
    <section className="py-16 px-4 max-w-350 mx-auto overflow-hidden!">
      {/* Header Layout Grid Block */}
      <div className="mb-12 w-100 md:w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
            Trending Collection
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Our <span className="text-primary font-black">Best Sellers</span>
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm sm:text-base">
            The most requested, highly-rated books across our community networks right now. Secured via Stripe payments and fast delivery.
          </p>
        </div>
      </div>

      {/* Render the Carousel */}
      {bestSellersData.length > 0 ? (
        <BestSellersCarousel books={bestSellersData} />
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">No books match our best seller metrics at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default BestSellers;