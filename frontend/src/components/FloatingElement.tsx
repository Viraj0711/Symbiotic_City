import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
};

interface PulseElementProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export const PulseElement: React.FC<PulseElementProps> = ({
  children,
  scale = 1.05,
  duration = 2,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
