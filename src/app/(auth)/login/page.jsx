import Link from "next/link";
import { BiBookOpen } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-white rounded-[40px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">

        {/* Left Interactive Side: Branding & Info Banner */}
        <div className="hidden lg:flex relative bg-black p-10 md:p-14 flex-col justify-between min-h-[500px]">

          {/* High-quality Library/Book background matching the BookHub ecosystem */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop"
              alt="BookHub Library"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-white">
              {/* Logo icon requested: BiBookOpen */}
              <BiBookOpen size={48} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold tracking-tight">
                BookHub
              </h2>
            </Link>

            <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your favorite books delivered straight to your doorstep
            </h1>

            <p className="mt-6 text-gray-300 leading-7 max-w-md text-base">
              Explore diverse global collections, connect with local library inventories,
              and enjoy seamless secure door-to-door deliveries powered by Stripe.
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
              <p className="text-white text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fc4a32]"></span>
                Doorstep Delivery • Verified Reviews • Secure Checkout
              </p>

              <p className="mt-2 text-gray-300 text-sm leading-6">
                Join our decentralized reading ecosystem. Instantly rent or request book
                deliveries from certified independent library owners and curators.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Responsive Login Form Handles */}
        <div className="p-8 md:p-14 flex items-center">
          <div className="w-full max-w-lg mx-auto">

            {/* Mobile / Small screen branding */}
            <Link href="/" className="flex lg:hidden items-center gap-2 text-black mb-10">
              <BiBookOpen size={42} className="text-[#fc4a32]" />
              <h2 className="text-3xl font-bold">
                BookHub
              </h2>
            </Link>

            <h2 className="text-4xl font-extrabold text-black tracking-tight">
              Welcome Back
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Login to access your dashboard, track delivery orders, or manage inventories.
            </p>

            <form className="mt-10 space-y-6">
              <div>
                <label className="text-sm font-semibold text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full mt-2 border border-[#fc4a32] rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-2 focus:ring-[#fad4de] transition bg-white text-black"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-black">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#fc4a32] hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full mt-2 border border-[#fc4a32] rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-2 focus:ring-[#fad4de] transition bg-white text-black"
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
                Sign In
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
              Don’t have an account yet?{" "}
              <Link
                href="/register"
                className="text-[#fc4a32] font-semibold hover:underline cursor-pointer transition"
              >
                Register Now
              </Link>
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}