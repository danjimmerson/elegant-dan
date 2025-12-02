import ReactPlayer from "react-player";
import { useMusic } from "@/context/MusicContext";
import { useEffect, useRef } from "react";

const GlobalAudioPlayer = () => {
    const { isPlaying, isMuted, volume, currentStation, setIsPlaying } = useMusic();
    const playerRef = useRef<any>(null);

    useEffect(() => {
        console.log("GlobalAudioPlayer: Mounted");
    }, []);

    useEffect(() => {
        console.log("GlobalAudioPlayer: State changed", { isPlaying, currentStation });
    }, [isPlaying, currentStation]);

    // Error handling
    const handleError = (e: any) => {
        console.error("Global Audio Player Error:", e);
        // Optional: Try next station or show notification
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                right: 0,
                width: "1px",
                height: "1px",
                opacity: 0.01,
                pointerEvents: "none",
                zIndex: -1,
                overflow: "hidden"
            }}
        >
            {currentStation.type === "track" ? (
                <audio
                    ref={(el) => {
                        if (el) {
                            el.volume = volume;
                            el.muted = isMuted;
                            if (isPlaying) {
                                const playPromise = el.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(error => {
                                        console.error("Audio play failed:", error);
                                        setIsPlaying(false);
                                    });
                                }
                            } else {
                                el.pause();
                            }
                        }
                    }}
                    src={currentStation.url}
                    onEnded={() => setIsPlaying(false)}
                />
            ) : (
                <ReactPlayer
                    ref={playerRef}
                    url={currentStation.url}
                    playing={isPlaying}
                    muted={isMuted}
                    volume={volume}
                    width="100%"
                    height="100%"
                    playsinline
                    onEnded={() => setIsPlaying(false)}
                    onError={handleError}
                    config={{
                        youtube: {
                            playerVars: {
                                playsinline: 1,
                                controls: 0,
                                disablekb: 1,
                                fs: 0,
                                iv_load_policy: 3,
                                modestbranding: 1,
                                origin: window.location.origin,
                            } as any
                        },
                        soundcloud: {
                            options: {
                                auto_play: false,
                                buying: false,
                                liking: false,
                                download: false,
                                sharing: false,
                                show_artwork: false,
                                show_comments: false,
                                show_playcount: false,
                                show_user: false,
                                visual: false
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default GlobalAudioPlayer;
