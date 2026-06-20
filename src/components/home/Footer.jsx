import Link from "next/link";
import {
  BiBookOpen,
} from "react-icons/bi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const quickLinks = [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "Privacy Policy",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "#",
      label: "Facebook",
    },
    {
      icon: FaXTwitter,
      href: "#",
      label: "X",
    },
    {
      icon: FaInstagram,
      href: "#",
      label: "Instagram",
    },
    {
      icon: FaLinkedinIn,
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="mt-24 bg-[#151515] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex items-center justify-center">
                <BiBookOpen className="text-4xl text-[#fc4a32]" />
              </div>

              <span className="text-3xl font-bold tracking-tight">
                BookHub
              </span>
            </Link>

            <p className="mt-5 max-w-md text-slate-400 leading-relaxed">
              Discover your next favorite book. Explore bestselling
              titles, timeless classics, and hidden gems from authors
              around the world.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="
                      w-11 h-11
                      rounded-full
                      border border-white/10
                      flex items-center justify-center
                      text-slate-300
                      hover:text-white
                      hover:bg-[#fc4a32]
                      hover:border-[#fc4a32]
                      transition-all duration-300
                    "
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="
                      text-slate-400
                      hover:text-[#fc4a32]
                      transition-colors duration-300
                    "
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Contact
            </h3>

            <div className="space-y-4 text-slate-400">
              <p>
                support@bookhub.com
              </p>

              <p>
                +1 (800) 123-4567
              </p>

              <p>
                Available 24/7 for readers worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <p className="text-sm text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} BookHub. All rights reserved.
            </p>

            <p className="text-sm text-slate-500 text-center md:text-right">
              Designed for readers, built with ❤️ for books.
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}