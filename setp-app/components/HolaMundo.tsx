'use client';

import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

interface HolaMundoProps {
  /** Main hero title — animated letter by letter */
  title: string;
  /** Tech stack subtitle — shown in monospace with fade-in */
  subtitle: string;
  /** Brief description paragraph */
  description: string;
}

/** Tech stack labels shown as interactive badges */
const TECH_STACK = [
  'Next.js 16',
  'TypeScript 5',
  'Framer Motion',
  'Zod',
  'Vercel',
] as const;

/**
 * HolaMundo — Client Component
 *
 * Full-screen hero section with:
 * - Ambient glow orbs (CSS animated)
 * - Dot-grid overlay (masked radial)
 * - Eyebrow badge with pulsing status dot
 * - Main title: per-letter Framer Motion animation (AnimatedText)
 * - Glowing gradient underline (scaleX entrance)
 * - Subtitle + description with staggered fade-blur-in
 * - Tech stack badges with hover micro-interactions
 * - Bottom ornamental line with dot
 *
 * All timing is orchestrated from letterCount to chain elements sequentially.
 */
export default function HolaMundo({ title, subtitle, description }: HolaMundoProps) {
  // Orchestrated timing chain based on title length
  const letterCount      = title.length;
  const staggerPerLetter = 0.06;
  const titleDuration    = letterCount * staggerPerLetter + 0.72; // last letter + its own duration

  const titleAnimStart   = 0.2;                            // eyebrow starts at 0.1
  const underlineDelay   = titleAnimStart + titleDuration - 0.2; // slightly overlaps end
  const subtitleDelay    = underlineDelay + 0.3;
  const descDelay        = subtitleDelay + 0.5;
  const badgesDelay      = descDelay + 0.35;
  const bottomLineDelay  = badgesDelay + TECH_STACK.length * 0.08 + 0.3;

  return (
    <div className="hola-mundo-container">

      {/* ── Ambient Glow Orbs (CSS-animated) ── */}
      <div className="ambient-glow ambient-glow-1" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-2" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-3" aria-hidden="true" />

      {/* ── Dot-Grid Overlay ── */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* ── Main Content ── */}
      <div className="content-wrapper">

        {/* Eyebrow badge */}
        <motion.div
          className="eyebrow-badge"
          initial={{ opacity: 0, scale: 0.85, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Sistema Fullstack TypeScript activo"
        >
          <span className="badge-dot" aria-hidden="true" />
          <span>Sistema Fullstack TypeScript</span>
        </motion.div>

        {/* Main title — per-letter animation via AnimatedText */}
        <h1 className="main-title" aria-label={title}>
          <AnimatedText
            text={title}
            delay={titleAnimStart}
            className="title-text"
          />
        </h1>

        {/* Glowing gradient underline */}
        <motion.div
          className="title-underline"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            delay: underlineDelay,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden="true"
        />

        {/* Subtitle — monospace tech label */}
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: subtitleDelay,
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {subtitle}
        </motion.p>

        {/* Description paragraph */}
        <motion.p
          className="description"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: descDelay,
            duration: 0.75,
            ease: 'easeOut',
          }}
        >
          {description}
        </motion.p>

        {/* Tech stack badges */}
        <motion.div
          className="tech-badges"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: badgesDelay,
            duration: 0.7,
            ease: 'easeOut',
          }}
          role="list"
          aria-label="Stack tecnológico"
        >
          {TECH_STACK.map((tech, i) => (
            <motion.span
              key={tech}
              className="tech-badge"
              role="listitem"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: badgesDelay + i * 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.09, y: -3 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Bottom ornamental line */}
        <motion.div
          className="bottom-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: bottomLineDelay, duration: 1, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <span className="line-segment" />
          <span className="line-dot" />
          <span className="line-segment" />
        </motion.div>

      </div>
    </div>
  );
}
