'use client'
import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  barCount?: number
  color?: string
  height?: number
  className?: string
}

export function AudioVisualizer({ barCount = 32, color = '#d4af37', height = 60, className = '' }: AudioVisualizerProps) {
  const barsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    barsRef.current.forEach((bar, i) => {
      if (!bar) return
      const randomize = () => {
        const h = Math.random() * 80 + 10
        bar.style.height = `${h}%`
        bar.style.opacity = `${0.4 + Math.random() * 0.6}`
      }
      const delay = (i * 50) % 300
      const interval = setInterval(randomize, 150 + Math.random() * 250)
      intervals.push(interval)
      setTimeout(randomize, delay)
    })
    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <div
      className={`flex items-end gap-px ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) barsRef.current[i] = el }}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${20 + Math.random() * 60}%`,
            background: `linear-gradient(180deg, ${color} 0%, ${color}55 100%)`,
            minWidth: 2,
            transitionDuration: `${150 + Math.random() * 150}ms`,
            transitionTimingFunction: 'ease-in-out',
          }}
        />
      ))}
    </div>
  )
}

export function EqBars({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const heights: Record<string, number> = { sm: 14, md: 20, lg: 28 }
  const h = heights[size]
  return (
    <div className={`eq-container ${className}`} style={{ height: h }} aria-hidden="true">
      {[1,2,3,4,5].map(n => (
        <div
          key={n}
          className={`eq-bar animate-eq-${n}`}
          style={{
            width: size === 'sm' ? 2 : 3,
            animationName: `eq${n}`,
            animationDuration: `${0.6 + n * 0.1}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  )
}

export function WaveformBars({ className = '' }: { className?: string }) {
  const bars = 40
  return (
    <div className={`audio-wave ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = (i * 0.05) % 0.8
        const duration = 0.6 + Math.random() * 0.6
        return (
          <div
            key={i}
            className="wave-bar"
            style={
              {
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                height: 4 + Math.random() * 16,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
