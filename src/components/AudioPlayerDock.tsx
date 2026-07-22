import React, { useState, useEffect } from 'react';
import { TrackAsset } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, Disc, Sparkles, CheckCircle2, ChevronUp, ChevronDown, Music } from 'lucide-react';

interface AudioPlayerDockProps {
  tracks: TrackAsset[];
  activeTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
}

export default function AudioPlayerDock({ tracks, activeTrackId, onSelectTrack }: AudioPlayerDockProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(32); // percentage

  const currentTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    onSelectTrack(nextTrack.id);
    setIsPlaying(true);
    setPlaybackProgress(0);
  };

  const handlePrevTrack = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    onSelectTrack(prevTrack.id);
    setIsPlaying(true);
    setPlaybackProgress(0);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-3 right-3 left-3 md:left-auto md:w-[540px] z-50 transition-all duration-300">
      <div className="bg-[#2D2926] text-[#F2E9DE] rounded-xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Progress Bar */}
        <div className="w-full bg-white/10 h-1 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          setPlaybackProgress(Math.round((clickX / rect.width) * 100));
        }}>
          <div
            className="bg-[#C68B59] h-full transition-all duration-150 relative"
            style={{ width: `${playbackProgress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md transform scale-0 hover:scale-100 transition-transform"></div>
          </div>
        </div>

        {/* Main Dock Header Control */}
        <div className="p-3 flex items-center justify-between gap-3">
          {/* Left Track Meta */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-lg bg-[#C68B59]/20 border border-[#C68B59]/40 flex items-center justify-center shrink-0 relative overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
              <Disc className={`h-5 w-5 text-[#C68B59] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-serif font-bold text-white">
                  {currentTrack.master.recordingTitle}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#7D7C44]/30 text-[#7D7C44] border border-[#7D7C44]/40 shrink-0">
                  {currentTrack.master.format}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#F2E9DE]/60 truncate mt-0.5">
                {currentTrack.master.primaryArtists.join(', ')} • ISRC: {currentTrack.master.isrc}
              </p>
            </div>
          </div>

          {/* Equalizer Visualizer Bars when Playing */}
          {isPlaying && (
            <div className="hidden sm:flex items-end gap-1 h-5 px-2">
              <span className="w-0.5 bg-[#C68B59] animate-[bounce_0.6s_infinite_100ms] h-full"></span>
              <span className="w-0.5 bg-[#C68B59] animate-[bounce_0.6s_infinite_300ms] h-3/4"></span>
              <span className="w-0.5 bg-[#C68B59] animate-[bounce_0.6s_infinite_200ms] h-2/4"></span>
              <span className="w-0.5 bg-[#C68B59] animate-[bounce_0.6s_infinite_400ms] h-full"></span>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevTrack}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 bg-[#C68B59] hover:bg-[#A65D50] text-[#2D2926] font-bold rounded-lg shadow-md transition-all transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors hidden sm:block"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-[#A65D50]" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors border-l border-white/10 ml-1"
              title="Toggle Track Splits & Details"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Metadata & Split Drawer */}
        {isExpanded && (
          <div className="p-3.5 border-t border-white/10 bg-black/20 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-wider font-bold">
              <span>Split Breakdown</span>
              <span>Status: {currentTrack.status}</span>
            </div>

            <div className="space-y-1.5">
              {currentTrack.publishing.songwriters.map((writer, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded text-[11px]">
                  <div className="flex items-center gap-2">
                    {writer.verified ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#7D7C44]" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C68B59]"></span>
                    )}
                    <span className="text-white font-semibold">{writer.name}</span>
                    <span className="text-white/40">({writer.role})</span>
                  </div>
                  <span className="font-bold text-[#C68B59]">{writer.shareSplit}%</span>
                </div>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between text-[10px] text-white/60 border-t border-white/5">
              <span>ISWC: {currentTrack.publishing.iswc}</span>
              <span>Language: {currentTrack.regionalTags.language} ({currentTrack.regionalTags.region})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
