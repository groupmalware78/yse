'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, Music } from 'lucide-react'

const playlist = [
  { title: 'Crown Pon Mi Head', artist: 'King Yardie', duration: 222 },
  { title: 'Natural Mystic Rising', artist: 'Empress Zara', duration: 255 },
  { title: 'Caribbean Queen', artist: 'Sista Nova', duration: 208 },
  { title: 'Yardie Anthem', artist: 'King Yardie', duration: 241 },
  { title: 'Zion Gates', artist: 'Empress Zara', duration: 238 },
]

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function FloatingPlayer() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(18)

  const track = playlist[trackIndex]

  const prevTrack = () => setTrackIndex(i => (i - 1 + playlist.length) % playlist.length)
  const nextTrack = () => setTrackIndex(i => (i + 1) % playlist.length)

  return (
    <motion.div
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-40 player-bar"
    >
      {/* Progress bar (top edge) */}
      <div className="progress-bar w-full rounded-none">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4 md:gap-6">
              {/* Vinyl thumb */}
              <div className="w-10 h-10 vinyl rounded-full flex-shrink-0 shadow-gold animate-spin-slow" />

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate leading-none mb-0.5">{track.title}</p>
                <p className="text-gold text-xs truncate">{track.artist}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTrack}
                  className="text-white/50 hover:text-white transition-colors hidden sm:block"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={() => setPlaying(v => !v)}
                  className="w-9 h-9 rounded-full btn-gold flex items-center justify-center flex-shrink-0"
                >
                  {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                </button>
                <button
                  onClick={nextTrack}
                  className="text-white/50 hover:text-white transition-colors hidden sm:block"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Progress */}
              <div className="hidden md:flex items-center gap-2 w-48">
                <span className="text-white/30 text-xs w-8">{formatTime(Math.floor(track.duration * progress / 100))}</span>
                <div
                  className="progress-bar flex-1"
                  onClick={e => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setProgress(Math.round(((e.clientX - r.left) / r.width) * 100))
                  }}
                >
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-white/30 text-xs w-8">{formatTime(track.duration)}</span>
              </div>

              {/* Volume & minimize */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(v => !v)}
                  className="text-white/40 hover:text-white transition-colors hidden lg:block"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => setMinimized(true)}
                  className="text-white/30 hover:text-white transition-colors"
                  aria-label="Minimize player"
                >
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
  )
}
