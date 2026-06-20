import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

import newsletterBG from "@/images/newsletterBG.png";

export default function NewsletterSection() {
  return (
    <section className="py- lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] min-h-[280px] lg:min-h-[320px] shadow-sm">
          
          {/* Background Image */}
          <Image
            src={newsletterBG}
            alt="Newsletter Background"
            fill
            priority
            className="object-cover"
          />

          {/* Optional Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center min-h-[280px] lg:min-h-[320px] px-6">
            <div className="w-full max-w-3xl text-center">
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Get{" "}
                <span className="text-[#fc4a32]">
                  10% Off
                </span>{" "}
                Your Order!
              </h2>

              <p className="mt-4 text-sm sm:text-base font-medium text-white/90">
                Enter your email and receive a 10% discount on your next order!
              </p>

              {/* Newsletter Form UI */}
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="group flex items-center rounded-full bg-white p-1.5 shadow-sm hover:shadow-lg transition-all duration-300">
                    
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="
                        flex-1
                        bg-transparent
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-slate-700
                        outline-none
                        placeholder:text-slate-400
                      "
                    />

                    <button
                      type="button"
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        bg-[#fc4a32]
                        px-7
                        py-4
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#ef4028]
                        hover:shadow-sm
                        cursor-pointer
                      "
                    >
                      Subscribe
                      <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}