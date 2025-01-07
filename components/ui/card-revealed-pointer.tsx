'use client'

import { cn } from '@/lib/utils'
import { useMotionValue, motion, useMotionTemplate } from 'motion/react'

export function CardRevealedPointer({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, 0.4), transparent 80%)`

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect()

        mouseX.set(e.clientX - left)
        mouseY.set(e.clientY - top)
      }}
      className={cn('group relative overflow-hidden rounded-sm bg-transparent', className)}
    >
      <div className='absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent' />
      <motion.div
        className='pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100'
        style={{
          background: background,
        }}
      />
      <div>{children}</div>
    </div>
  )
}
