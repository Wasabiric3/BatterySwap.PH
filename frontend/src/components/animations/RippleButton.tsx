'use client';

import { useCallback, useRef } from 'react';

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RippleButton({ children, className = '', onClick }: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height);

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;

        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      }

      onClick?.();
    },
    [onClick]
  );

  return (
    <button ref={buttonRef} className={`btn-ripple ${className}`} onClick={handleClick}>
      {children}
    </button>
  );
}
