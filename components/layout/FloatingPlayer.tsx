'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Music } from 'lucide-react'
import type { PlayerTrack } from '@/lib/queries'

function formatTime(s: number) {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function FloatingPlayer({ tracks }: { tracks: PlayerTrack[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const track = tracks[trackIndex]

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.src = track.url
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
  }, [trackIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }, [playing])

  const prev = () => setTrackIndex(i => (i - 1 + tracks.length) % tracks.length)
  const next = () => setTrackIndex(i => (i + 1) % tracks.length)

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const r = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - r.left) / r.width) * duration
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Don't render if no tracks configured
  if (tracks.length === 0) return null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={e => setDuration(e.currentTarget.duration)}
        onEnded={next}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="metadata"
      />

      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-40 player-bar"
      >
        {/* Progress bar (top edge) */}
        <div className="progress-bar w-full rounded-none cursor-pointer" onClick={seek}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence initial={false}>
          {!minimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4 md:gap-6">
                {/* Vinyl thumb */}
                <div className={`w-10 h-10 vinyl rounded-full flex-shrink-0 shadow-gold ${playing ? 'animate-spin-slow' : ''}`} />

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate leading-none mb-0.5">{track.title}</p>
                  <p className="text-gold text-xs truncate">{track.artist}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button onClick={prev} className="text-white/50 hover:text-white transition-colors hidden sm:block">
                    <SkipBack size={16} />
                  </button>
                  <button onClick={togglePlay} className="w-9 h-9 rounded-full btn-gold flex items-center justify-center flex-shrink-0">
                    {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>
                  <button onClick={next} className="text-white/50 hover:text-white transition-colors hidden sm:block">
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Seek + time */}
                <div className="hidden md:flex items-center gap-2 w-48">
                  <span className="text-white/30 text-xs w-8 text-right">{formatTime(currentTime)}</span>
                  <div className="progress-bar flex-1 cursor-pointer" onClick={seek}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-white/30 text-xs w-8">{formatTime(duration)}</span>
                </div>

                {/* Volume & minimize */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setMuted(v => !v)} className="text-white/40 hover:text-white transition-colors hidden lg:block">
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button onClick={() => setMinimized(true)} className="text-white/30 hover:text-white transition-colors" aria-label="Minimize player">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized tab */}
        {minimized && (
          <div className="flex justify-center py-1">
            <button
              onClick={() => setMinimized(false)}
              className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <Music size={12} />
              {track.title} · {track.artist}
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
