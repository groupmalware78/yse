'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gold?: boolean
  hover?: boolean
  delay?: number
}

export function GlassCard({ children, className = '', gold = false, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -6, transition: { duration: 0.3 } } : undefined}
      className={clsx(
        'rounded-2xl overflow-hidden',
        gold ? 'glass-gold' : 'glass',
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeader({
  label,
  title,
  subtitle,
  center = false,
}: {
  label: string
  title: React.ReactNode
  subtitle?: string
  center?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? 'text-center' : ''}
    >
      <p className="section-label mb-4">{label}</p>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
