'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260527_061033_0f369854-8849-4214-8787-9181479c8121.mp4'

const MAX_WIDTH = 960
const PLAYBACK_FPS = 30

export function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const framesRef = useRef<HTMLCanvasElement[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let canceled = false
    let intervalId: number | null = null
    let rvfcId: number | null = null
    const captured: HTMLCanvasElement[] = []

    const captureFrame = () => {
      if (canceled || video.ended) return
      if (!video.videoWidth || !video.videoHeight) return
      const ratio = video.videoHeight / video.videoWidth
      const w = Math.min(MAX_WIDTH, video.videoWidth)
      const h = Math.round(w * ratio)
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) return
      try {
        ctx.drawImage(video, 0, 0, w, h)
        captured.push(c)
      } catch {
        // Likely a CORS taint — give up silently and leave the raw video visible.
      }
    }

    type VideoWithRVFC = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number
    }

    const v = video as VideoWithRVFC
    const supportsRVFC = typeof v.requestVideoFrameCallback === 'function'

    const tickRVFC = () => {
      if (canceled || video.ended) return
      captureFrame()
      rvfcId = v.requestVideoFrameCallback!(tickRVFC)
    }

    const onPlay = () => {
      if (supportsRVFC) {
        rvfcId = v.requestVideoFrameCallback!(tickRVFC)
      } else {
        intervalId = window.setInterval(captureFrame, 1000 / 60)
      }
    }

    const onEnded = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
      framesRef.current = captured
      if (captured.length > 0) setReady(true)
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('ended', onEnded)

    if (!video.paused) onPlay()

    return () => {
      canceled = true
      video.removeEventListener('play', onPlay)
      video.removeEventListener('ended', onEnded)
      if (intervalId !== null) window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const frames = framesRef.current
    if (frames.length === 0) return

    canvas.width = frames[0].width
    canvas.height = frames[0].height

    let idx = 0
    let dir = 1
    let last = 0
    const frameMs = 1000 / PLAYBACK_FPS
    let raf = 0
    let canceled = false

    const loop = (now: number) => {
      if (canceled) return
      if (now - last >= frameMs) {
        last = now
        ctx.drawImage(frames[idx], 0, 0)
        idx += dir
        if (idx >= frames.length - 1) {
          idx = frames.length - 1
          dir = -1
        } else if (idx <= 0) {
          idx = 0
          dir = 1
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      canceled = true
      cancelAnimationFrame(raf)
    }
  }, [ready])

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        style={{ display: ready ? 'none' : 'block' }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: ready ? 'block' : 'none' }}
      />
    </div>
  )
}
