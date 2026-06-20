import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiUser, FiDollarSign } from 'react-icons/fi';

// Sample mock data array extracted directly from your dataset specs
const bestSellersMock = [
  {
    id: 1,
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    description: "An epic high-fantasy novel that sets off an incredible adventure across Middle-earth.",
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400",
    deliveryFee: 4.50,
    status: { stage: "Available", count: 5 }
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel focusing on the dangers of totalitarianism and extreme surveillance.",
    category: "Dystopian",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400",
    deliveryFee: 3.00,
    status: { stage: "Available", count: 3 }
  },
  {
    id: 3,
    title: "Neuromancer",
    author: "William Gibson",
    description: "The seminal cyberpunk novel following a washed-up computer hacker hired for one last ultimate corporate heist.",
    category: "Sci-Fi",
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400",
    deliveryFee: 5.00,
    status: { stage: "Checked Out", count: 0 }
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A profound exploration of racial injustice and destroyed innocence in the American Deep South.",
    category: "Classic Literature",
    coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400",
    deliveryFee: 3.50,
    status: { stage: "Available", count: 2 }
  }
];

export default function BestSeller() {
  return (
    <section className="w-full py-16 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block Structure */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Curated Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
              Trending Best Sellers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm md:text-base">
              Explore the most requested books this week. Reserve your copy instantly and get safe doorstep delivery managed securely via Stripe.
            </p>
          </div>
          
          <Link 
            href="/browse" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors duration-150"
          >
            <span>View Entire Catalog</span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Responsive CSS Scroll Snap Grid Container */}
        {/* Mobile: Smooth Overflow Swipe | Mid-Large Viewports: Structured Static Flex Grid */}
        <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
          {bestSellersMock.map((book) => {
            const isAvailable = book.status.stage === "Available";
            
            return (
              <div 
                key={book.id}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Top Section: Media Asset & Sticky Indicator Layers */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* Dynamic Interactive Stock Badge */}
                  <span className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md transition-colors duration-300 ${
                    isAvailable 
                      ? "bg-emerald-500/90 dark:bg-emerald-600/90 text-white" 
                      : "bg-rose-500/90 dark:bg-rose-600/90 text-white"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {isAvailable ? `${book.status.count} Available` : 'Checked Out'}
                  </span>

                  {/* Category Identifier */}
                  <span className="absolute top-3 right-3 z-10 bg-slate-900/70 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-xs">
                    {book.category}
                  </span>

                  {/* Core Book Image Asset with Clean Tailwind Hover Scale Animation */}
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Modern Overlay Gradient Mask on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Bottom Section: Text Content & Primary Call to Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                      <FiUser className="shrink-0" />
                      <span className="truncate">{book.author}</span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 tracking-tight group-hover:text-primary transition-colors duration-150">
                      {book.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  {/* Structural Info & Call to Action Trigger */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Delivery Fee
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white flex items-center">
                        <FiDollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 -mr-0.5" />
                        {book.deliveryFee.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/browse/${book.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-colors duration-150 shadow-sm shadow-primary/10 active:scale-98"
                    >
                      <FiBookOpen className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}