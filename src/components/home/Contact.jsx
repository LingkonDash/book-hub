"use client";

import { motion } from "framer-motion";

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+880 1700-000000",
    sub: "Mon–Fri, 9am to 6pm",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "hello@bookhub.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Location",
    value: "Dhaka, Bangladesh",
    sub: "Serving nationwide delivery",
  },
];

const socials = [
  {
    label: "Facebook",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring", stiffness: 60, damping: 14 },
  }),
};

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#fad4de]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#fc4a32]/8 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 mb-4 text-[11px] font-bold tracking-widest uppercase bg-[#fad4de] text-[#fc4a32] rounded-full">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            We&apos;d Love to{" "}
            <span className="text-[#fc4a32]">Hear From You</span>
          </h2>
          <p className="mx-auto text-[15px] text-gray-500 max-w-md leading-relaxed">
            Have a question, suggestion, or just want to say hi? Reach out — our team is always happy to help.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — contact info cards + socials */}
          <div className="flex flex-col gap-4">

            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="flex items-center gap-4 bg-white border border-[#fad4de] rounded-2xl p-5 group hover:shadow-[0_4px_24px_rgba(252,74,50,0.10)] transition-shadow duration-300"
              >
                {/* Icon bubble */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-[#fad4de]/60 flex items-center justify-center text-[#fc4a32] flex-shrink-0 group-hover:bg-[#fc4a32] group-hover:text-white transition-colors duration-300"
                >
                  {item.icon}
                </motion.div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5 m-0">
                    {item.label}
                  </p>
                  <p className="text-[15px] font-bold text-gray-900 m-0 truncate">
                    {item.value}
                  </p>
                  <p className="text-[12px] text-gray-400 m-0 mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Social row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-3 mt-1"
            >
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                Follow us
              </span>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <motion.button
                    key={s.label}
                    whileHover={{ scale: 1.12, backgroundColor: "#fc4a32", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl border cursor-pointer border-[#fad4de] bg-white text-[#fc4a32] flex items-center justify-center transition-colors duration-200"
                  >
                    {s.icon}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — static form UI (no functionality) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="bg-white border border-[#fad4de] rounded-2xl p-6 sm:p-8"
          >
            {/* Avatar group — social proof */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                {["amy1", "bob2", "cara3", "dan4"].map((seed) => (
                  <div
                    key={seed}
                    className="w-8 h-8 rounded-full border-2 border-white bg-[#fad4de] overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=fad4de`}
                      alt="user"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-gray-500 m-0">
                <span className="font-bold text-gray-900">1,200+</span> readers reached out this month
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                    Your Name
                  </label>
                  <input placeholder="e.g. Lingkon Dash" className="w-full rounded-xl border border-[#fad4de] bg-[#fdfcfc] px-4 py-3 text-[14px] text-gray-400 cursor-default">
                    
                  </input>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input placeholder="you@example.com" className="w-full rounded-xl border border-[#fad4de] bg-[#fdfcfc] px-4 py-3 text-[14px] text-gray-400 cursor-default">
                    
                  </input>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                  Subject
                </label>
                <input placeholder="What&apos;s this about?" className="w-full rounded-xl border border-[#fad4de] bg-[#fdfcfc] px-4 py-3 text-[14px] text-gray-400 cursor-default">
                  
                </input>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                  Message
                </label>
                <textarea placeholder="Write your message here..." className="w-full rounded-xl border border-[#fad4de] bg-[#fdfcfc] px-4 py-3 text-[14px] text-gray-400 cursor-default h-28 items-start flex">
                  
                </textarea>
              </div>

              {/* Send button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(252,74,50,0.28)" }}
                whileTap={{ scale: 0.97 }}
                disabled
                className="w-full py-3.5 rounded-xl cursor-pointer bg-[#fc4a32] text-white text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 cursor-default"
              >
                Send Message
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" />
                </svg>
              </motion.button>

              <p className="text-center text-[12px] text-gray-400 m-0">
                🔒 Your information is safe with us. No spam, ever.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}