'use client'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setDotPos({ x: e.clientX, y: e.clientY })
      setTimeout(() => setPos({ x: e.clientX, y: e.clientY }), 60)
    }

    const onEnter = () => setIsHovering(true)
    const onLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role=button]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div
        className="cursor-ring hidden lg:block"
        style={{
          left: pos.x - 14,
          top: pos.y - 14,
          transform: isHovering ? 'scale(1.8)' : 'scale(1)',
          opacity: isHovering ? 0.5 : 1,
        }}
      />
      <div
        className="cursor-dot hidden lg:block"
        style={{ left: dotPos.x - 2.5, top: dotPos.y - 2.5 }}
      />
    </>
  )
}
