"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BiBookOpen } from 'react-icons/bi';
import { FiUser, FiChevronDown, FiMenu, FiX, FiGrid, FiLogOut, FiLayers, FiBookOpen as FiBook, FiSearch, FiMail, FiMapPin, FiMessageSquare, FiPhoneCall } from 'react-icons/fi';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { toast } from "react-toastify";

export default function Navbar({ session }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- Scroll & Mouse tracking states ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  // Adjusted paths for proper active routing state checks
  const navItems = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Browse Books', hasDropdown: true, path: '/browse' },
    { name: 'About us', hasDropdown: true, path: '/about' },
    { name: 'Contact', hasDropdown: true, path: '/contact' },
  ];

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'librarian') return '/dashboard/librarian';
    return '/dashboard/user';
  };

  const handleLogout = async () => {
    const data = await authClient.signOut();
    if (!data?.success) {
      toast.success('Signout Successful!')
      router.push('/login');
    } else {
      toast.success('Something went wrong, try again')
    }
  };

  // --- Scroll + Mouse Upward Event Listeners ---
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // If user scrolls down past 10px and is moving downwards, hide it
        if (window.scrollY > lastScrollY && window.scrollY > 10) {
          setIsVisible(false);
          setIsProfileOpen(false); // Close active profile dropdowns on hide
        } else {
          // If user scrolls upwards, show it immediately
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    // Make navbar visible if the mouse moves close to the top of the viewport (UX improvement)
    const handleMouseMove = (e) => {
      if (e.clientY <= 45) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full fixed top-0 left-0 right-0 z-50 shadow-md"
    >
      <nav className="w-full bg-primary text-white px-6 py-4 relative">
        <div className="max-w-400 mx-auto flex items-center justify-between">

          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide">
            <BiBookOpen className="text-3xl" />
            <span>BookHub</span>
          </Link>

          {/* 2. Desktop Navigation Menu */}
          <ul className="hidden lg:flex items-center gap-12 font-medium text-[15px]">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <li
                  key={index}
                  className="relative py-2"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center text-base font-bold gap-1 relative pb-3 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                      }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <FiChevronDown className={`text-sm transition-transform absolute bottom-1/2 -right-5 duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    )}

                    {/* Active Route indicator dot dropping from behind text to underneath */}
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderline"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full z-0"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 26,
                          y: { type: "tween", duration: 0.25, ease: "easeOut" }
                        }}
                      />
                    )}
                  </Link>

                  {/* Animated Sub-navigation Dropdowns */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute left-1/2 -translate-x-1/2 mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 ${item.name === 'Browse Books' ? 'w-120' : item.name === 'Contact' ? 'w-90' : 'w-48'
                          }`}
                      >
                        {/* BROWSE BOOKS CUSTOM POPUP ACCORDING TO USER REQUIREMENT */}
                        {item.name === 'Browse Books' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <FiLayers /> Categories
                              </p>
                              <div className="space-y-1">
                                <Link href="/browse?cat=all" className="block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors">
                                  All Collections
                                  <span className="block text-xs font-normal text-slate-400">Explore complete delivery catalogs</span>
                                </Link>
                                <Link href="/browse?cat=academic" className="block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors">
                                  Academic & Research
                                  <span className="block text-xs font-normal text-slate-400">Textbooks and scientific journals</span>
                                </Link>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <FiBook /> Quick Filters
                              </p>
                              <div className="space-y-1">
                                <Link href="/browse?status=available" className="block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors">
                                  Available Now
                                  <span className="block text-xs font-normal text-slate-400">Ready for instant doorstep drop</span>
                                </Link>
                                <Link href="/browse?action=search" className="block px-3 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors">
                                  Advanced Search
                                  <span className="block text-xs font-normal text-slate-400">Filter by fee range or author</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CONTACT FIELD CUSTOM POPUP ACCORDING TO USER REQUIREMENT */}
                        {item.name === 'Contact' && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Get In Touch</p>
                            <Link href="/contact" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
                              <FiMessageSquare className="text-xl text-primary mt-0.5" />
                              <div>
                                <span className="block text-sm font-bold">Help Desk Tickets</span>
                                <span className="block text-xs text-slate-400">Open a support thread for tracking</span>
                              </div>
                            </Link>
                            <Link href="/contact" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors">
                              <FiMapPin className="text-xl text-primary mt-0.5" />
                              <div>
                                <span className="block text-sm font-bold">Library Network Hubs</span>
                                <span className="block text-xs text-slate-400">Locate partner distribution branches</span>
                              </div>
                            </Link>
                            <div className="p-3 bg-slate-50 rounded-xl mt-2 border border-slate-100 flex items-center gap-3">
                              <FiPhoneCall className="text-xl text-emerald-500 animate-pulse" />
                              <div>
                                <span className="block text-xs font-bold text-slate-500">Urgent Delivery Hotlines</span>
                                <span className="block text-sm font-extrabold text-slate-800">+1 (555) 019-2831</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* DEFAULT BACKUP LAYOUT FALLBACK FOR OTHER CHOSEN DROPDOWNS (E.G. ABOUT US) */}
                        {item.name !== 'Browse Books' && item.name !== 'Contact' && (
                          <div className="space-y-1">
                            <Link href="#" className="block px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                              Sub Option 1
                            </Link>
                            <Link href="#" className="block px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                              Sub Option 2
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className='flex justify-center items-center gap-4'>

            {/* 3. Actions / User Profile Section */}
            <div className="hidden md:flex items-center gap-6">
              {session?.user ? (
                /* User Profile Dynamic Pop-up (Logged In)  */
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                    className="flex items-center gap-1.5 focus:outline-none p-1 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="User Menu"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "Profile"}
                          className="w-full h-full object-cover"
                          height={40}
                          width={40}
                        />
                      ) : (
                        <FiUser className="text-xl" />
                      )}
                    </div>
                    <FiChevronDown className={`text-sm transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Animated Profile Dropdown div  */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white text-slate-800 shadow-2xl p-2 border border-slate-100"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-sm font-bold truncate">{session?.user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{session?.user.email}</p>
                        </div>

                        <Link
                          href={getDashboardPath(session?.user.role)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <FiGrid className="text-slate-400" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <FiUser className="text-slate-400" />
                          <span>Profile</span>
                        </Link>

                        <hr className="border-slate-100 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors text-left"
                        >
                          <FiLogOut />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Register Button (Logged Out)  */
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-white text-primary text-sm font-bold rounded-xl shadow-md hover:bg-opacity-90 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Login
                </Link>
              )}
            </div>

            {/* 4. Hamburger Icon Menu (Mobile Only) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>

          </div>

          {/* 5. Responsive Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden absolute top-full left-0 w-full bg-primary border-t border-white/10 overflow-hidden shadow-xl"
              >
                <div className="px-6 pt-3 pb-6 space-y-3">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.path;
                    return (
                      <div key={index}>
                        <Link
                          href={item.path}
                          onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                          className={`block py-2 text-base font-bold transition-opacity ${isActive ? 'opacity-100 underline underline-offset-4' : 'opacity-90 hover:opacity-100'}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                    );
                  })}

                  <hr className="border-white/10 my-2" />

                  {session ? (
                    <div className="space-y-2 pt-1">
                      <Link
                        href={getDashboardPath(session.user.role)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-base font-bold opacity-90 hover:opacity-100"
                      >
                        <FiGrid /> Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-base font-bold opacity-90 hover:opacity-100"
                      >
                        <FiUser /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 py-2 text-base font-bold text-rose-300 text-left"
                      >
                        <FiLogOut /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 md:hidden">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center w-full px-5 py-3 bg-white text-primary font-bold rounded-xl shadow-md"
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  );
}