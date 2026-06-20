"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { 
  FaTruck, 
  FaCreditCard, 
  FaStar, 
  FaBookOpen, 
  FaShieldAlt, 
  FaUserCheck 
} from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';

const benefits = [
  {
    id: 1,
    title: "Doorstep Delivery",
    desc: "Skip the physical commute completely",
    icon: <FaTruck className="text-[#f23c24] text-xl" />,
  },
  {
    id: 2,
    title: "Secure Stripe Checkout",
    desc: "Safe & instantaneous handling of delivery fees",
    icon: <FaCreditCard className="text-[#f23c24] text-xl" />,
  },
  {
    id: 3,
    title: "Verified Reviews Only",
    desc: "Feedback restricted exclusively to proven readers",
    icon: <FaStar className="text-[#f23c24] text-xl" />,
  },
  {
    id: 4,
    title: "Local Library Network",
    desc: "Connecting avid readers with neighborhood owners",
    icon: <FaBookOpen className="text-[#f23c24] text-xl" />,
  },
  {
    id: 5,
    title: "Role-Based Integrity",
    desc: "Isolated portals for Readers, Librarians & Admins",
    icon: <FaShieldAlt className="text-[#f23c24] text-xl" />,
  },
  {
    id: 6,
    title: "Empowered Librarians",
    desc: "List inventories & manage custom requests effortlessly",
    icon: <FaUserCheck className="text-[#f23c24] text-xl" />,
  },
];

const BenefitsMarquee = () => {
  return (
    <div className="relative w-full py-6 bg-gradient-to-r from-white via-[#fad4de]/20 to-white dark:from-slate-940 dark:via-slate-900 border-y border-[#fad4de]/60 overflow-hidden shadow-sm">
      {/* Premium UX Gradient Glass Shading Overlays (Blends edge limits seamlessly) */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

      <Swiper
        modules={[Autoplay]}
        loop={true}
        speed={4500} // Smooth, constant cinematic velocity
        delay={0}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // UX Best practice: pauses when user reviews elements
        }}
        slidesPerView="auto"
        spaceBetween={24}
        allowTouchMove={false} // Clean automatic alignment stream
        className="benefits-swiper-wrapper flex items-center"
      >
        {/* Render twice for an unbroken, infinitely looping fluid track timeline */}
        {[...benefits, ...benefits].map((benefit, index) => (
          <SwiperSlide 
            key={`${benefit.id}-${index}`} 
            style={{ width: 'auto' }}
            className="py-1"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-[#fad4de] hover:border-[#f23c24]/40 hover:shadow-md transition-all duration-300 group cursor-default">
              {/* Dynamic Theme Icon Circle */}
              <div className="p-2.5 rounded-xl bg-[#fad4de]/50 group-hover:bg-[#f23c24]/10 transition-colors duration-300">
                {benefit.icon}
              </div>
              
              {/* Typography */}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap">
                  {benefit.title}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap mt-0.5">
                  {benefit.desc}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Global CSS Inject to ensure uninterrupted linear marquee progression motion */}
      <style jsx global>{`
        .benefits-swiper-wrapper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
};

export default BenefitsMarquee;