"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoCardData } from "@/lib/types";
import { loadYouTubeAPI } from "@/lib/youtube";

export default function VideoCard({
  video,
  active,
  index,
  onWatched,
}: {
  video: VideoCardData;
  active: boolean;
  index: number;
  onWatched: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const doneRef = useRef(false);
  const onWatchedRef = useRef(onWatched);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    onWatchedRef.current = onWatched;
  }, [onWatched]);

  const isYouTube = Boolean(video.youtubeId);
  const isMp4 = !isYouTube && Boolean(video.videoUrl);

  // Create the YouTube player once per card.
  useEffect(() => {
    if (!isYouTube) return;
    let disposed = false;
    loadYouTubeAPI()
      .then((YT) => {
        if (disposed || !hostRef.current) return;
        playerRef.current = new YT.Player(hostRef.current, {
          videoId: video.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            iv_load_policy: 3,
            mute: 1,
          },
          events: {
            onReady: () => {
              if (disposed) return;
              // Let taps fall through to the card's own click handler.
              const iframe = hostRef.current?.querySelector("iframe");
              if (iframe) iframe.style.pointerEvents = "none";
              setReady(true);
            },
            onStateChange: (e: any) => {
              setPlaying(e.data === 1);
              if (e.data === 0 && !doneRef.current) {
                // Video finished → mark watched → advance.
                doneRef.current = true;
                onWatchedRef.current();
              }
            },
          },
        });
      })
      .catch(() => {});
    return () => {
      disposed = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [isYouTube, video.youtubeId]);

  // Play when this card is active, pause when it is not.
  useEffect(() => {
    if (!isYouTube || !ready) return;
    const p = playerRef.current;
    if (!p) return;
    if (active) {
      p.mute?.();
      p.playVideo?.();
    } else {
      p.pauseVideo?.();
    }
  }, [active, isYouTube, ready]);

  // Poll real playback progress (for the top bar).
  useEffect(() => {
    if (!active || !isYouTube || !ready) return;
    const iv = setInterval(() => {
      const p = playerRef.current;
      if (p?.getCurrentTime && p?.getDuration) {
        const d = p.getDuration();
        const c = p.getCurrentTime();
        if (d > 0) setProgress(Math.min(100, (c / d) * 100));
      }
    }, 300);
    return () => clearInterval(iv);
  }, [active, isYouTube, ready]);

  function skip() {
    if (!active || doneRef.current) return;
    doneRef.current = true;
    onWatchedRef.current();
  }

  return (
    <div
      data-card
      data-index={index}
      onClick={skip}
      className="relative h-full w-full snap-start overflow-hidden bg-black"
      style={{ background: video.gradient }}
    >
      {/* story-style progress bar (real playback position) */}
      <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* YouTube player host */}
      {isYouTube && <div ref={hostRef} className="absolute inset-0 h-full w-full" />}

      {/* direct mp4 */}
      {isMp4 && (
        <video
          className="h-full w-full object-cover"
          src={video.videoUrl}
          autoPlay={active}
          muted
          playsInline
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
          }}
          onEnded={() => {
            if (active && !doneRef.current) {
              doneRef.current = true;
              onWatchedRef.current();
            }
          }}
        />
      )}

      {/* fallback: animated caption card */}
      {!isYouTube && !isMp4 && (
        <div className="fade-up flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
          <div className="text-7xl drop-shadow-lg">{video.emoji}</div>
          <div className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
            {video.topic}
          </div>
          <h2 className="mt-2 max-w-sm text-3xl font-black leading-tight drop-shadow">
            {video.title}
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/90">{video.transcript}</p>
          <p className="mt-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
            Swipe up to continue
          </p>
        </div>
      )}

      {/* subtle "not playing yet" indicator */}
      {isYouTube && active && !playing && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="text-6xl text-white/70">▶</span>
        </div>
      )}

      {/* bottom meta overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-5 pb-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">
            {video.emoji}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">@{video.creator}</div>
            <div className="truncate text-xs text-white/70">
              {video.title} · {video.tags.join(" · ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
