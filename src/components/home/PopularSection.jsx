
import React from 'react';

import Link from 'next/link';

import { FaStar, FaTruck, FaArrowRight, FaChevronRight } from 'react-icons/fa';

import { getAllBooks } from '@/utils/actions/server/getAllBooks';



const StarRating = ({ rating }) => {

  return (

    <div className="flex items-center gap-1">

      {[1, 2, 3, 4, 5].map((star) => (

        <FaStar

          key={star}

          className={`text-[11px] ${star <= Math.round(rating)

            ? 'text-amber-400'

            : 'text-slate-200 dark:text-slate-700'

            }`}

        />

      ))}

      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">

        {rating?.toFixed(1)}

      </span>

    </div>

  );

};



const PopularSection = async () => {

  let books = [];

  try {

    books = await getAllBooks('');

  } catch (error) {

    console.error('Failed to fetch books on server side:', error);

  }



  const bestSellersData = Array.isArray(books)

    ? books.filter((book) => book.rating?.average >= 4.0).slice(0, 5)

    : [];



  // Featured = first book, grid = next 4

  const featuredBook = bestSellersData[0] || null;

  const gridBooks = bestSellersData.slice(1, 5);



  const popularAuthors = [

    {

      id: 1,

      name: 'Warren Graham',

      genre: 'Cyberpunk / Sci-Fi',

      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',

    },

    {

      id: 2,

      name: 'Tricia Allison',

      genre: 'Dystopian Classic',

      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',

    },

    {

      id: 3,

      name: 'Suzanne Casey',

      genre: 'High Fantasy Epic',

      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',

    },

    {

      id: 4,

      name: 'Rita James',

      genre: 'Literary Fiction',

      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',

    },

    {

      id: 5,

      name: 'Rex Rios',

      genre: 'Mystery / Thriller',

      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',

    },

    {

      id: 6,

      name: 'Randal Adkins',

      genre: 'Historical Fiction',

      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',

    },

  ];



  return (

    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-x-0 top-0 h-48 bg-[#fad4de]/20 blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-[28px] border border-[#fad4de]/50 shadow-sm p-4 sm:p-6">



        {/* ── LEFT: Popular Authors Sidebar ── */}

        <aside className="w-full lg:w-[260px] flex-shrink-0">

          <div className="bg-gradient-to-b from-[#fffaf9] to-white rounded-3xl p-5 border border-[#fad4de]/60 shadow-sm">

            <h2 className="text-base font-bold text-slate-800 mb-4 tracking-tight">

              Popular Authors

            </h2>

            <div className="h-px bg-[#fad4de]/60 mb-4" />



            <ul className="space-y-1">

              {popularAuthors.map((author) => (

                <li key={author.id}>

                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-[#fff7f8] transition-all duration-200 group text-left">

                    <img

                      src={author.avatar}

                      alt={author.name}

                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-[#fad4de]"

                    />

                    <span className="flex-1 min-w-0">

                      <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">

                        {author.name}

                      </span>

                    </span>

                    <FaChevronRight className="text-[10px] text-slate-300 dark:text-slate-600 group-hover:text-[#fc4a32] transition-colors flex-shrink-0" />

                  </button>

                </li>

              ))}

            </ul>

          </div>

        </aside>



        {/* ── RIGHT: Keep Reading Panel ── */}

        <div className="flex-1 min-w-0">



          {/* Section header */}

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">

              Keep Reading

            </h2>

            <Link

              href="/browse"

              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#fc4a32] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"

            >

              View All

              <FaArrowRight className="text-[10px]" />

            </Link>

          </div>



          {bestSellersData.length === 0 ? (

            <div className="w-full text-center py-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700">

              <p className="text-slate-500 font-medium">No top-tier books met the threshold.</p>

            </div>

          ) : (

            <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">



              {/* ── Featured Book (top, horizontal layout) ── */}

              {featuredBook && (

                <div className="pb-5">

                  <Link

                    href={`/browse/${featuredBook.id}`}

                    className="flex gap-5 group"

                  >

                    {/* Cover */}

                    <div className="w-[120px] sm:w-[140px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[2/3]">

                      <img

                        src={featuredBook.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400'}

                        alt={featuredBook.title}

                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

                        loading="lazy"

                      />

                    </div>



                    {/* Info */}

                    <div className="flex flex-col justify-center gap-2 py-1">

                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#fc4a32] transition-colors duration-200 leading-snug">

                        {featuredBook.title}

                      </h3>



                      <StarRating rating={featuredBook.rating?.average} />



                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">

                        {featuredBook.author}

                      </p>



                      <p className="text-sm text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed max-w-md">

                        {featuredBook.description}

                      </p>



                      <p className="text-xl font-extrabold text-[#fc4a32] mt-1">

                        ${featuredBook.deliveryFee?.toFixed(2)}

                      </p>

                    </div>

                  </Link>

                </div>

              )}



              {/* ── 2×2 Grid Books ── */}

              {gridBooks.length > 0 && (

                <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 divide-slate-100 dark:divide-slate-800 sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-slate-100 sm:dark:[&>*:nth-child(odd)]:border-slate-800 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-slate-100 sm:dark:[&>*:nth-child(n+3)]:border-slate-800">

                  {gridBooks.map((book) => (

                    <Link

                      key={book.id}

                      href={`/browse/${book.id}`}

                      className="flex gap-3.5 p-4 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150 first:pt-0 sm:first:pt-4"

                    >

                      {/* Thumbnail */}

                      <div className="w-16 h-[86px] flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">

                        <img

                          src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200'}

                          alt={book.title}

                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

                          loading="lazy"

                        />

                      </div>



                      {/* Meta */}

                      <div className="flex flex-col justify-center gap-1 min-w-0">

                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#fc4a32] transition-colors duration-200 line-clamp-1">

                          {book.title}

                        </h4>

                        <StarRating rating={book.rating?.average} />

                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">

                          {book.author}

                        </p>

                        <p className="text-sm font-extrabold text-[#fc4a32] mt-0.5">

                          ${book.deliveryFee?.toFixed(2)}

                        </p>

                      </div>

                    </Link>

                  ))}

                </div>

              )}



            </div>

          )}

        </div>



      </div>

    </section>

  );

};



export default PopularSection;

