import { Card } from '@heroui/react';
import React from 'react';
import { ImBook } from 'react-icons/im'; // Elegant book icon
import { HiArrowLeft } from 'react-icons/hi';
import LoginForm from '@/components/login&registration/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-[var(--bg-app)] min-h-screen w-full flex flex-col items-center justify-start relative font-sans antialiased text-[var(--text-main)]">

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center w-full px-4 py-12">
        <Card className="w-full max-w-md bg-white border border-[var(--border-subtle)] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.05)] rounded-2xl overflow-hidden relative z-10 pb-8">
          
          {/* Card Curved Top Banner */}
          <div className="bg-[var(--color-primary)] px-6 pt-6 pb-12 text-center relative text-white">
            <button className="absolute left-6 top-7 text-white/80 hover:text-white transition-colors cursor-pointer">
              <HiArrowLeft className="text-lg" />
            </button>
            <h2 className="text-xl font-bold tracking-wide">Welcome Back</h2>
          </div>

          {/* Overlapping Floating Circle with Book Icon */}
          <div className="flex justify-center -mt-8 relative z-20 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white text-[var(--color-primary)]">
              <ImBook className="text-2xl" />
            </div>
          </div>

          <p className="text-xs text-center text-[var(--text-muted)] mb-6">
            Sign in to continue to <span className="font-semibold text-[var(--color-primary)]">BookHub</span>
          </p>

          {/* Stylized Minimal Login Form */}
          <div className="px-6 sm:px-10">
            <LoginForm />
          </div>

        </Card>
      </main>
    </div>
  );
};

export default LoginPage;