import { useEffect, useRef, useState } from 'react';

// Hook for managing focus
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);

  const setFocus = (element?: HTMLElement | null) => {
    if (element) {
      focusRef.current = element;
      element.focus();
    }
  };

  const returnFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
      focusRef.current = null;
    }
  };

  return { setFocus, returnFocus };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onEnter?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onArrowRight?.();
        break;
    }
  };

  return { handleKeyDown };
};

// Hook for announcing content to screen readers
export const useScreenReader = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

// Hook for managing ARIA expanded states
export const useAriaExpanded = (initialState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggle = () => setIsExpanded(!isExpanded);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    ariaProps: {
      'aria-expanded': isExpanded,
    },
  };
};

// Hook for generating unique IDs for accessibility
export const useUniqueId = (prefix = 'id') => {
  const id = useRef<string>();
  
  if (!id.current) {
    id.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return id.current;
};

// Hook for managing focus trap in modals/dialogs
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

export default {
  useFocusManagement,
  useKeyboardNavigation,
  useScreenReader,
  useAriaExpanded,
  useUniqueId,
  useFocusTrap,
};