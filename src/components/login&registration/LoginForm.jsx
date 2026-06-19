"use client";

import React, { useState } from 'react';
import { Input, Button, Checkbox } from '@heroui/react';
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      
      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[var(--text-dark)] uppercase tracking-wider">Email</label>
        <Input
          type="email"
          placeholder="rhonda@outlook.com"
          variant="bordered"
          radius="md"
          startContent={<HiOutlineMail className="text-lg text-[var(--text-muted)] mr-1 flex-shrink-0" />}
          classNames={{
            inputWrapper: "border-[var(--border-subtle)] hover:border-slate-300 focus-within:!border-[var(--color-primary)] bg-slate-50/50 h-11 transition-all shadow-2xs",
            input: "text-[var(--text-dark)] placeholder:text-slate-400 text-sm",
          }}
        />
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-[var(--text-dark)] uppercase tracking-wider">Password</label>
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="••••••••"
          variant="bordered"
          radius="md"
          startContent={<HiOutlineLockClosed className="text-lg text-[var(--text-muted)] mr-1 flex-shrink-0" />}
          endContent={
            <button className="focus:outline-none text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors" type="button" onClick={toggleVisibility}>
              {isVisible ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
            </button>
          }
          classNames={{
            inputWrapper: "border-[var(--border-subtle)] hover:border-slate-300 focus-within:!border-[var(--color-primary)] bg-slate-50/50 h-11 transition-all shadow-2xs",
            input: "text-[var(--text-dark)] placeholder:text-slate-400 text-sm",
          }}
        />
      </div>

      {/* Remember Me Toggle */}
      <div className="flex items-center pt-0.5">
        <Checkbox 
          radius="xs" 
          classNames={{
            label: "text-[var(--text-muted)] text-sm selection:bg-transparent font-medium",
            wrapper: "after:bg-[var(--color-primary)] before:border-slate-300"
          }}
        >
          Remember me
        </Checkbox>
      </div>

      {/* Clean Primary Button */}
      <Button
        type="submit"
        radius="md"
        className="w-full h-11 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm shadow-md shadow-blue-500/10 transition-all mt-1"
      >
        Sign In
      </Button>

      {/* Bottom Route Alternate Links */}
      <div className="text-center mt-3 text-sm text-[var(--text-muted)]">
        Dont have an account?{' '}
        <a href="#" className="text-[var(--color-primary)] font-bold hover:underline transition-all">
          Register
        </a>
      </div>

    </form>
  );
};

export default LoginForm;