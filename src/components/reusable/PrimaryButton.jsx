'use client';

import { Button } from '@heroui/react';

const PrimaryButton = ({ children }) => {
  return (
    <Button
      radius="lg"
      className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-medium
        px-6
        h-11
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:scale-[1.02]
        active:scale-[0.98]
      "
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;