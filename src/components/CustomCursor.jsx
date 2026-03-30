import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 })
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out' })
    }

    const expandCursor = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.2 })
      gsap.to(follower, { scale: 1.5, opacity: 0.5, duration: 0.2 })
    }
    const shrinkCursor = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 })
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.2 })
    }

    window.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('button, a, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', expandCursor)
      el.addEventListener('mouseleave', shrinkCursor)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ transform: 'translate(-50%, -50%)' }} />
      <div ref={followerRef} className="cursor-follower" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  )
}
