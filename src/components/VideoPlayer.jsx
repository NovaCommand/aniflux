import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const DEMO_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const VideoPlayer = ({ streamUrl = DEMO_STREAM, title }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const hideControlsTimer = useRef(null);

    // Initialize HLS
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
        const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            playerRef.current = hls;

            return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = streamUrl;
        }
    }, [streamUrl]);

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100 || 0);

            // Track buffered amount
            if (video.buffered.length > 0) {
                setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
            }
        };

        const onLoadedMetadata = () => setDuration(video.duration);
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);

        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);

        return () => {
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
        };
    }, []);

    // Auto-hide controls
    const resetHideTimer = () => {
        setShowControls(true);
        clearTimeout(hideControlsTimer.current);
        hideControlsTimer.current = setTimeout(() => {
            if (playing) setShowControls(false);
        }, 3000);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowRight':
                    videoRef.current.currentTime += 10;
                    break;
                case 'ArrowLeft':
                    videoRef.current.currentTime -= 10;
                    break;
                case 'ArrowUp':
                    setVolume(v => Math.min(1, v + 0.1));
                    break;
                case 'ArrowDown':
                    setVolume(v => Math.max(0, v - 0.1));
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'm':
                    toggleMute();
                    break;
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [playing]);

    const togglePlay = () => {
        const video = videoRef.current;
        playing ? video.pause() : video.play();
    };

    const toggleMute = () => {
        videoRef.current.muted = !muted;
        setMuted(!muted);
    };

    const toggleFullscreen = () => {
        const container = playerRef.current?.media?.parentElement
            ?? videoRef.current?.parentElement;
        if (!document.fullscreenElement) {
            container?.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = ratio * duration;
    };

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value);
        videoRef.current.volume = val;
        setVolume(val);
        setMuted(val === 0);
    };

    const formatTime = (s) => {
        if (isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="relative w-full bg-black group select-none"
            style={{ aspectRatio: '16/9' }}
            onMouseMove={resetHideTimer}
            onMouseLeave={() => playing && setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full"
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
            />

            {/* Play/Pause Big Icon Flash */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${playing ? 'opacity-0' : 'opacity-100'}`}>
                <div className="bg-black/40 rounded-full p-6">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                <div className="relative px-4 pb-4 pt-8">
                    {/* Title */}
                    {title && (
                        <p className="text-white text-sm font-medium mb-3 truncate">{title}</p>
                    )}

                    {/* Progress Bar */}
                    <div
                        className="relative w-full h-1 bg-white/20 rounded cursor-pointer mb-3 group/bar hover:h-2 transition-all"
                        onClick={handleSeek}
                    >
                        {/* Buffered */}
                        <div
                            className="absolute h-full bg-white/30 rounded"
                            style={{ width: `${buffered}%` }}
                        />
                        {/* Played */}
                        <div
                            className="absolute h-full bg-red-500 rounded"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
                            style={{ left: `calc(${progress}% - 6px)` }}
                        />
                    </div>

                    {/* Bottom Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">

                            {/* Play/Pause */}
                            <button onClick={togglePlay} className="text-white hover:text-red-400 transition">
                                {playing ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                                ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                )}
                            </button>

                            {/* Skip Back/Forward */}
                            <button
                                onClick={() => videoRef.current.currentTime -= 10}
                                className="text-white hover:text-red-400 transition text-xs font-bold">
                                ⟪10
                            </button>
                            <button
                                onClick={() => videoRef.current.currentTime += 10}
                                className="text-white hover:text-red-400 transition text-xs font-bold">
                                10⟫
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-2">
                                <button onClick={toggleMute} className="text-white hover:text-red-400 transition">
                                    {muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                                </button>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={muted ? 0 : volume}
                                    onChange={handleVolume}
                                    className="w-20 accent-red-500"
                                />
                            </div>

                            {/* Time */}
                            <span className="text-white text-xs tabular-nums">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-red-400 transition">
                                {fullscreen ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                </svg>
                                ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;