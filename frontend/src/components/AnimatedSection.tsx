import React from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'zoom' | 'stagger';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  rootMargin = '0px'
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold, rootMargin });

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000]);

  return (
    <motion.div
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
