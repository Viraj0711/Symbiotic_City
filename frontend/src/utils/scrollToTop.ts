/**
 * Utility function to scroll to top of page with smooth animation
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Enhanced scroll to top with delay for route changes
 */
export const scrollToTopDelayed = (delay: number = 100) => {
  setTimeout(() => {
    scrollToTop();
  }, delay);
};