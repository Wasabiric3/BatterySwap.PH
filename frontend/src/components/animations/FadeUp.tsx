'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function FadeUp({ children, delay = 0, className = '' }: FadeUpProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Staggered word reveal for hero headline ────────────────── */

interface StaggeredTextProps {
  words: { text: string; className: string }[];
}

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      delay: 0.2 + i * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function StaggeredHeadline({ words }: StaggeredTextProps) {
  return (
    <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.9] tracking-tight text-center">
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          custom={i}
          className={`inline-block ${word.className}`}
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {word.text}
        </motion.span>
      ))}
    </h1>
  );
}

/* ─── Fade-up for subtext and other elements ────────────────── */

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const animateInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function AnimateIn({ children, delay = 0, className = '' }: AnimateInProps) {
  return (
    <motion.div
      variants={animateInVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}
