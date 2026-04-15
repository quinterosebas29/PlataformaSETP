'use client';

import { motion } from 'framer-motion';

interface AnimatedTextProps {
  /** The string to animate letter by letter */
  text: string;
  /** Optional initial delay before the stagger animation begins (in seconds) */
  delay?: number;
  /** Optional additional className for the outer wrapper span */
  className?: string;
}

/** Container: controls the stagger of children letters */
const containerVariants = {
  hidden: {},
  visible: (delayChildren: number = 0) => ({
    transition: {
      staggerChildren: 0.06,
      delayChildren,
    },
  }),
};

/**
 * Each individual letter: slides up with opacity + scale spring.
 * NOTE: No filter:blur here — CSS blur on elements with background-clip:text
 * makes gradient text invisible during animation across WebKit/Blink engines.
 */
const letterVariants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/**
 * AnimatedText — Client Component
 *
 * Animates each character of `text` individually using Framer Motion.
 * Letters drop from above with a blur-resolve + mild 3D rotation effect,
 * staggered by ~60ms per letter.
 *
 * Usage:
 *   <AnimatedText text="Hola Mundo" delay={0.2} className="title-text" />
 */
export default function AnimatedText({
  text,
  delay = 0,
  className = '',
}: AnimatedTextProps) {
  const letters = text.split('');

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
