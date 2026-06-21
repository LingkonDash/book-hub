"use client";

import { motion } from "framer-motion";
import { FiPackage, FiStar, FiAward, FiTrendingUp } from "react-icons/fi";

const librarians = [
  {
    id: 1,
    name: "Ayesha Rahman",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ayesha&backgroundColor=fad4de",
    location: "Dhaka, BD",
    deliveries: 312,
    rating: 4.9,
    specialty: "Classic Literature",
    badge: "🥇",
    rank: 1,
  },
  {
    id: 2,
    name: "Tanvir Hossain",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Tanvir&backgroundColor=fcd5ce",
    location: "Chittagong, BD",
    deliveries: 274,
    rating: 4.8,
    specialty: "Sci-Fi & Fantasy",
    badge: "🥈",
    rank: 2,
  },
  {
    id: 3,
    name: "Priya Chowdhury",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=fce4ec",
    location: "Sylhet, BD",
    deliveries: 198,
    rating: 4.7,
    specialty: "Self-Help & Growth",
    badge: "🥉",
    rank: 3,
  },
];

const rankConfig = {
  1: {
    ringColor: "#fc4a32",
    ringWidth: "3px",
    labelBg: "#fc4a32",
    labelText: "#fff",
    cardBg: "bg-white dark:bg-slate-900",
    cardBorder: "border-[#fc4a32]/40",
    scale: "scale-105",
    avatarSize: "w-24 h-24 sm:w-28 sm:h-28",
  },
  2: {
    ringColor: "#fad4de",
    ringWidth: "2px",
    labelBg: "#fad4de",
    labelText: "#7c2d3d",
    cardBg: "bg-white dark:bg-slate-900",
    cardBorder: "border-slate-200 dark:border-slate-800",
    scale: "",
    avatarSize: "w-20 h-20 sm:w-24 sm:h-24",
  },
  3: {
    ringColor: "#fad4de",
    ringWidth: "2px",
    labelBg: "#fad4de",
    labelText: "#7c2d3d",
    cardBg: "bg-white dark:bg-slate-900",
    cardBorder: "border-slate-200 dark:border-slate-800",
    scale: "",
    avatarSize: "w-20 h-20 sm:w-24 sm:h-24",
  },
};

// Stagger parent
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Each card
const cardVariant = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Avatar ring pulse for rank 1
const pulseRing = {
  animate: {
    boxShadow: [
      "0 0 0 0px rgba(252,74,50,0.35)",
      "0 0 0 8px rgba(252,74,50,0)",
    ],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
  },
};

export default function TopLibrarians() {
  return (
    <section className="w-full py-16 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-3"
          >
            Community Stars
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Top Librarians
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm md:text-base"
          >
            Celebrating the providers with the most completed deliveries this month.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px -60px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7 items-end"
        >
          {librarians.map((lib) => {
            const cfg = rankConfig[lib.rank];
            const isFirst = lib.rank === 1;

            return (
              <motion.div
                key={lib.id}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                className={`
                  relative flex flex-col items-center text-center rounded-2xl border
                  px-6 py-8 ${cfg.cardBg} ${cfg.cardBorder} ${cfg.scale}
                  shadow-sm hover:shadow-md transition-shadow duration-300
                `}
                style={{ borderWidth: isFirst ? "1.5px" : "1px" }}
              >
                {/* Rank badge — top right */}
                <span
                  className="absolute top-4 right-4 text-xl select-none"
                  aria-label={`Rank ${lib.rank}`}
                >
                  {lib.badge}
                </span>

                {/* Delivery count pill — top left */}
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + lib.rank * 0.1, duration: 0.45 }}
                  className="absolute top-4 left-4 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: cfg.labelBg, color: cfg.labelText }}
                >
                  <FiPackage className="w-3 h-3" />
                  {lib.deliveries} delivered
                </motion.span>

                {/* Avatar */}
                <motion.div
                  {...(isFirst ? pulseRing : {})}
                  className={`${cfg.avatarSize} rounded-full overflow-hidden mt-4 mb-4 shrink-0`}
                  style={{
                    outline: `${cfg.ringWidth} solid ${cfg.ringColor}`,
                    outlineOffset: "3px",
                  }}
                >
                  <img
                    src={lib.avatar}
                    alt={lib.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>

                {/* Name */}
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {lib.name}
                </h3>

                {/* Location */}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-3">
                  {lib.location}
                </p>

                {/* Specialty pill */}
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full mb-5">
                  {lib.specialty}
                </span>

                {/* Stats row */}
                <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <FiStar className="w-3 h-3" />
                      Rating
                    </span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + lib.rank * 0.08 }}
                      className="text-lg font-black text-slate-900 dark:text-white"
                    >
                      {lib.rating}
                    </motion.span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <FiTrendingUp className="w-3 h-3" />
                      Streak
                    </span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.55 + lib.rank * 0.08 }}
                      className="text-lg font-black text-slate-900 dark:text-white"
                    >
                      {[14, 9, 6][lib.rank - 1]}d
                    </motion.span>
                  </div>
                </div>

                {/* Progress bar — deliveries relative to #1 */}
                <div className="w-full mt-4">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                    <span>Delivery progress</span>
                    <span>{Math.round((lib.deliveries / 312) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(lib.deliveries / 312) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.1,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.4 + lib.rank * 0.1,
                      }}
                      className="h-full rounded-full"
                      style={{ background: "#fc4a32" }}
                    />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
            <FiAward className="w-4 h-4 text-primary" />
            Rankings update at the end of each month based on completed deliveries.
          </span>
        </motion.div>

      </div>
    </section>
  );
}