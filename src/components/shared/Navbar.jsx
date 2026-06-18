import logo from "@/images/logo.png";
import NavLinks from "../reusable/NavLinks";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "../reusable/PrimaryButton";

const routeLinks = [
  { path: "/", name: "Home" },
  { path: "/browse-books", name: "Browse Books" },
  { path: "/about", name: "About Us" },
  { path: "/contact", name: "Contact Us" },
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 max-w-400 mx-auto px-6 lg:px-8 py-4">
      <div className="h-16 bg-surface border shadow-xs border-slate-200 rounded-2xl flex items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src={logo}
              alt="BookHub Logo"
              width={38}
              height={38}
              className="object-contain"
            />

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              BookHub
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-5">
          {routeLinks.map((route) => (
            <li key={route.path}>
              <NavLinks href={route.path}>
                {route.name}
              </NavLinks>
            </li>
          ))}
        </ul>

        {/* Action */}
        <div className="flex items-center gap-3">
          <PrimaryButton>Login</PrimaryButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;