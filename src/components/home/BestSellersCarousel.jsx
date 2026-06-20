'use client';

import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import BookCard from '../shared/BookCard';

const BestSellersCarousel = ({ books = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  if (!books.length) return null;

  return (
    <div className="relative w-full">
      {/* Navigation Buttons — top-right */}
      <div className="absolute top-[-68px] right-0 hidden md:flex items-center gap-2 z-20">
        <button
          ref={prevRef}
          aria-label="Previous"
          className="w-9 h-9 rounded-xl border border-zinc-200 bg-white text-zinc-500 flex items-center justify-center transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 shadow-sm disabled:opacity-30 cursor-pointer"
        >
          <FaChevronLeft size={13} />
        </button>
        <button
          ref={nextRef}
          aria-label="Next"
          className="w-9 h-9 rounded-xl border border-zinc-200 bg-white text-zinc-500 flex items-center justify-center transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95 shadow-sm disabled:opacity-30 cursor-pointer"
        >
          <FaChevronRight size={13} />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        loop={true}
        spaceBetween={16}
        slidesPerView={6}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={
          swiperReady
            ? {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }
            : false
        }
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
          setSwiperReady(true);
        }}
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 14 },
          600: { slidesPerView: 4, spaceBetween: 16 },
          900: { slidesPerView: 4, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 20 },
        }}
        className="overflow-hidden!"
      >
        {books.map((book, idx) => (
          <SwiperSlide key={book.id} className="h-auto py-2">
            <BookCard book={book} index={idx} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSellersCarousel;