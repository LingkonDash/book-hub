import React from 'react';
import Link from 'next/link';
import { 
  FaBookOpen, 
  FaFlask, 
  FaGhost, 
  FaMasksTheater, 
  FaHandHoldingHeart, 
  FaBriefcase, 
  FaMicrochip, 
  FaMountain 
} from 'react-icons/fa6'; // Popular React Icons sets

// Categories data matching standard routing layouts
const categories = [
  { id: 1, name: 'Fiction', slug: 'fiction', count: 120, icon: FaBookOpen },
  { id: 2, name: 'Sci-Fi & Fantasy', slug: 'sci-fi-fantasy', count: 85, icon: FaFlask },
  { id: 3, name: 'Mystery & Thriller', slug: 'mystery-thriller', count: 64, icon: FaGhost },
  { id: 4, name: 'Biography & History', slug: 'biography-history', count: 92, icon: FaMasksTheater },
  { id: 5, name: 'Self-Help', slug: 'self-help', count: 45, icon: FaHandHoldingHeart },
  { id: 6, name: 'Business & Finance', slug: 'business-finance', count: 73, icon: FaBriefcase },
  { id: 7, name: 'Technology & Science', slug: 'tech-science', count: 110, icon: FaMicrochip },
  { id: 8, name: 'Action & Adventure', slug: 'action-adventure', count: 50, icon: FaMountain },
];

const CategoryBrowse = () => {
  return (
    <section className="py-15 px-4 max-w-400 mx-auto">
      {/* Header Layout */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Browse by <span className="text-primary font-black">Category</span>
        </h2>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Select a category to discover your next favorite book.
        </p>
      </div>

      {/* Grid Configuration:
          - Small/Mobile: grid-cols-1
          - Medium/Tablets: sm:grid-cols-2
          - Large Desktops: lg:grid-cols-4
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <Link 
              key={category.id} 
              href={`/browse?cat=${category.slug}`}
              className="group relative flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-200 hover:z-10 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 active:scale-[0.98] block"
            >
              {/* Icon Container with Primary Accent Color Mixes */}
              <div className="flex items-center justify-center p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                <Icon size={22} />
              </div>
              
              {/* Metadata content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 truncate group-hover:text-primary transition-colors duration-150">
                  {category.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium tracking-wide">
                  {category.count} Books
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryBrowse;