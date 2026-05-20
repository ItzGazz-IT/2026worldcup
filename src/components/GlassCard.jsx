import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable glassmorphism card.
 * Props: className, style, hover (bool), onClick, children, animate (bool)
 */
export default function GlassCard({
  children,
  className = '',
  style = {},
  hover = false,
  animate = true,
  onClick,
  delay = 0,
}) {
  const base = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.75rem',
    ...style,
  }

  const Component = animate ? motion.div : 'div'
  const animProps = animate
    ? {
        initial:    { opacity: 0, y: 20 },
        animate:    { opacity: 1, y: 0  },
        transition: { duration: 0.4, delay },
        whileHover: hover
          ? { y: -3, borderColor: 'rgba(46,115,168,0.3)', boxShadow: '0 0 25px rgba(46,115,168,0.08)' }
          : undefined,
      }
    : {}

  return (
    <Component
      style={base}
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...animProps}
    >
      {children}
    </Component>
  )
}
