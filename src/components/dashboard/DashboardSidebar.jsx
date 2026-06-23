"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Drawer, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard,
  MdMenuBook,
  MdLocalShipping,
  MdAddBox,
  MdPeople,
  MdReceiptLong,
  MdStar,
  MdPerson,
  MdLogout,
  MdMenu,
  MdClose,
  MdAdminPanelSettings,
  MdLibraryBooks,
} from "react-icons/md";
import { BiBookOpen } from "react-icons/bi";
import { toast } from "react-toastify";

// ─── Nav Definitions ───────────────────────────────────────────────
const userNavItems = [
  { label: "Overview", href: "/dashboard/user", icon: MdDashboard },
  { label: "My Deliveries", href: "/dashboard/user/my-deliveries", icon: MdLocalShipping },
  { label: "My Reviews", href: "/dashboard/user/my-reviews", icon: MdStar },
  { label: "Profile", href: "/dashboard/user/profile", icon: MdPerson },
];

const librarianNavItems = [
  { label: "Overview", href: "/dashboard/librarian", icon: MdDashboard },
  { label: "My Books", href: "/dashboard/librarian/my-books", icon: MdLibraryBooks },
  { label: "Add Book", href: "/dashboard/librarian/add-book", icon: MdAddBox },
  { label: "Manage Deliveries", href: "/dashboard/librarian/deliveries", icon: MdLocalShipping },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

const adminNavItems = [
  { label: "Overview", href: "/dashboard/admin", icon: MdAdminPanelSettings },
  { label: "All Books", href: "/dashboard/admin/books", icon: MdMenuBook },
  { label: "All Users", href: "/dashboard/admin/users", icon: MdPeople },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: MdReceiptLong },
  { label: "Profile", href: "/dashboard/profile", icon: MdPerson },
];

function getNavItems(role) {
  if (role === "admin") return adminNavItems;
  if (role === "librarian") return librarianNavItems;
  return userNavItems;
}

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50",
    dotColor: "bg-rose-500",
  },
  librarian: {
    label: "Librarian",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  user: {
    label: "Reader",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
};

// ─── Nav Link ──────────────────────────────────────────────────────
function NavLink({ item, pathname, onClick, index }) {
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group overflow-hidden ${
          isActive
            ? "text-white"
            : "text-gray-500 hover:text-[#fc4a32] hover:bg-[#fc4a32]/6"
        }`}
      >
        {/* Active pill background */}
        {isActive && (
          <motion.span
            layoutId="activeNavPill"
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fc4a32] to-[#ff6b4a] shadow-lg shadow-[#fc4a32]/30"
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          />
        )}

        {/* Left accent bar for active */}
        {isActive && (
          <motion.span
            layoutId="activeBar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white/60"
          />
        )}

        <item.icon
          className={`relative size-[18px] shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-white"
              : "text-gray-400 group-hover:text-[#fc4a32]"
          }`}
        />
        <span className="relative tracking-[-0.01em]">{item.label}</span>

        {/* Hover shimmer */}
        {!isActive && (
          <span className="absolute inset-0 rounded-2xl bg-[#fc4a32] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-200" />
        )}
      </Link>
    </motion.div>
  );
}

// ─── User Avatar ───────────────────────────────────────────────────
function UserAvatar({ session, size = "md" }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = session?.user?.image;
  const name = session?.user?.name || "U";
  const sizeClasses = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  if (imageUrl && !imgError) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden ring-2 ring-[#fc4a32]/20 shrink-0`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#fc4a32] to-[#ff7a5a] flex items-center justify-center shrink-0 ring-2 ring-[#fc4a32]/20`}
    >
      <MdPerson className="text-white size-5" />
    </div>
  );
}

// ─── Sidebar Core Content ──────────────────────────────────────────
function SidebarContent({ session, pathname, onNavClick, router }) {
  const role = session?.user?.userRole || "user";
  const navItems = getNavItems(role);
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG["user"];
  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";

  const handleLogout = async () => {
    const data = await authClient.signOut();
    if (!data?.success) {
      toast.success("Signed out successfully!");
      router.push("/login");
    } else {
      toast.error("Something went wrong, try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Brand ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="px-5 pt-6 pb-5"
      >
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fc4a32] to-[#e03a24] flex items-center justify-center shadow-md shadow-[#fc4a32]/35 group-hover:shadow-[#fc4a32]/50 transition-shadow duration-300">
            <BiBookOpen className="text-white size-5" />
          </div>
          <div className="leading-none">
            <span className="font-extrabold text-gray-900 text-[17px] tracking-tight">
              Biblio
            </span>
            <span className="font-extrabold text-[17px] tracking-tight text-[#fc4a32]">
              Dropp
            </span>
          </div>
        </Link>
      </motion.div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* ── User Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
        className="px-4 py-4"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50/80 border border-gray-100 px-3.5 py-3">
          <UserAvatar session={session} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-gray-900 truncate leading-snug">
              {name}
            </p>
            {email && (
              <p className="text-[11px] text-gray-400 truncate leading-snug mt-0.5">
                {email}
              </p>
            )}
            <span
              className={`inline-flex items-center gap-1 mt-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${roleConfig.bgColor} ${roleConfig.textColor}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dotColor}`} />
              {roleConfig.label}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] px-3.5 mb-3">
          Menu
        </p>
        {navItems.map((item, i) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
            index={i}
          />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="mx-4 h-px bg-gray-100" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="px-3 py-4 flex flex-col gap-1"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full group"
        >
          <MdLogout className="size-[18px] text-gray-400 group-hover:text-red-400 transition-colors shrink-0" />
          <span>Sign Out</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
        >
          <span className="text-base leading-none">←</span>
          <span>Back to Site</span>
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────
export default function DashboardSidebar({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100/80 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)] z-30"
      >
        <SidebarContent
          session={session}
          pathname={pathname}
          onNavClick={() => {}}
          router={router}
        />
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#fc4a32] to-[#e03a24] flex items-center justify-center shadow-md shadow-[#fc4a32]/30">
            <BiBookOpen className="text-white size-4" />
          </div>
          <span className="font-extrabold text-gray-900">
            Biblio<span className="text-[#fc4a32]">Dropp</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <UserAvatar session={session} size="sm" />

          <Drawer
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="left"
            size="xs"
            classNames={{
              backdrop: "bg-black/40 backdrop-blur-sm",
              base: "max-w-[272px] bg-white shadow-2xl",
            }}
          >
            <Button
              variant="light"
              isIconOnly
              onPress={() => setIsOpen(true)}
              className="text-gray-600 hover:bg-gray-100 rounded-xl min-w-0 w-9 h-9"
              aria-label="Open navigation menu"
            >
              <MdMenu className="size-5" />
            </Button>

            <Drawer.Content>
              <Drawer.Header className="pb-0 pt-4 px-0 border-none">
                <div className="flex items-center justify-end px-4">
                  <Drawer.CloseTrigger asChild>
                    <button className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                      <MdClose className="size-[18px]" />
                    </button>
                  </Drawer.CloseTrigger>
                </div>
              </Drawer.Header>
              <Drawer.Body className="p-0">
                <SidebarContent
                  session={session}
                  pathname={pathname}
                  onNavClick={() => setIsOpen(false)}
                  router={router}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>

      {/* Mobile top padding spacer */}
      <div className="lg:hidden h-[57px]" />
    </>
  );
}