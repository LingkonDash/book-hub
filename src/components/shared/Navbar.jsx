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
    <header className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-md">
      <nav className="max-w-400 mx-auto px-6 lg:px-8">
        <div className="h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-between px-5 lg:px-8">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
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
          <ul className="hidden md:flex items-center gap-8">
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
    </header>
  );
};

export default Navbar;