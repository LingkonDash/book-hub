'use client';

import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={false}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button
        radius="lg"
        className={`group relative overflow-hidden h-11 px-6 rounded-xl bg-primary text-white font-medium border border-primary transition-colors duration-300 ${className}`}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-secondary"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            originX: 0,
          }}
        />

        <motion.div
          className="absolute top-0 -left-120 h-full w-full bg-linear-to-r from-transparent via-white/20 to-transparent"
          whileHover={{ left: '120%' }}
          transition={{
            duration: 0.7,
            ease: 'easeInOut',
          }} 
        />

        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
};

export default PrimaryButton;