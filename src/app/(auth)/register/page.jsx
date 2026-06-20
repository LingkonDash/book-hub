import Link from "next/link";
import { BiBookOpen } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";

export default function RegisterPage() {
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-white rounded-[40px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Form Elements */}
        <div className="p-8 md:p-14 flex items-center">
          <div className="w-full max-w-lg mx-auto">
            
            {/* Responsive Mobile Header */}
            <Link href="/" className="flex lg:hidden items-center gap-2 text-black mb-10">
              <BiBookOpen size={42} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold">
                BookHub
              </h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-black tracking-tight">
              Create Account
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Join BookHub and start exploring literary classics, academic resources, and new titles delivered straight to your door.
            </p>

            <form className="mt-10 space-y-6">
              <div>
                <label className="text-sm font-semibold text-black">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fad4de] transition bg-white text-black"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fad4de] transition bg-white text-black"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-black">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Create your password"
                  className="w-full mt-2 border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-[#fc4a32] focus:ring-2 focus:ring-[#fad4de] transition bg-white text-black"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#fc4a32] rounded border-gray-300 text-[#fc4a32] focus:ring-[#fc4a32]"
                />
                <p className="text-sm text-gray-600">
                  I agree to the BookHub Terms & Privacy Policy
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fc4a32] hover:bg-[#fad4de] hover:text-black hover:border hover:border-[#fc4a32] border border-transparent text-white py-4 rounded-xl font-semibold transition duration-300 cursor-pointer shadow-md transform active:scale-98"
              >
                Create Account
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button className="border-primary border rounded-xl hover:bg-secondary py-4 px-5 flex items-center justify-center gap-3 text-primary hover:text-black  transition duration-300 cursor-pointer">
                <BsGoogle size={20} />
                <span className="font-medium">
                  Sign up with Google
                </span>
              </button>
            </div>

            <p className="mt-8 text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#fc4a32] font-semibold hover:underline cursor-pointer transition">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Branding Graphic */}
        <div className="hidden lg:flex relative bg-black p-10 md:p-14 flex-col justify-between min-h-[500px]">
          
          {/* Custom high contrast reading/library background placeholder */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop"
              alt="BookHub Library Showcase"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-white">
              <BiBookOpen size={48} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold tracking-tight">
                BookHub
              </h2>
            </Link>

            <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Discover amazing reading experiences from top inventories
            </h1>

            <p className="mt-6 text-gray-300 leading-7 max-w-md text-base">
              Create your account and unlock personalized reading recommendations, verified local library archives, and fast home delivery options.
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
              <p className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fc4a32]"></span>
                Doorstep Delivery • Certified Libraries • Instant Lending
              </p>

              <p className="mt-2 text-gray-300 text-sm leading-6">
                Enjoy physical books, simple item processing with secure checkout options, and a flawless decentralized catalog experience every single day.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}