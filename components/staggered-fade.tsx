'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface StaggeredFadeProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export function StaggeredFade({ text, className, style }: StaggeredFadeProps) {
  const ref = useRef<HTMLHeadingElement | null>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.h1
      ref={ref}
      style={style}
      className={cn(
        'text-xl text-center sm:text-4xl font-bold tracking-tighter md:text-6xl md:leading-[4rem]',
        className,
      )}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}
