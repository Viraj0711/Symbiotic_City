import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

interface PageWrapperProps {
  children: ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  type = 'button'
}) => {
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};
