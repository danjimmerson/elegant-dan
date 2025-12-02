import React, { createContext, useContext, useState, ReactNode } from "react";

export type Station = {
    id: string;
    name: string;
    url: string;
    type: "playlist" | "live" | "track";
};

export const STATIONS: Station[] = [
    {
        id: "lofi-zeno",
        name: "Lofi Hip Hop Radio",
        url: "https://stream.zeno.fm/0r0xa792kwzuv",
        type: "track",
    },
];

interface MusicContextType {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    currentStation: Station;
    togglePlay: () => void;
    toggleMute: () => void;
    setVolume: (val: number) => void;
    setStation: (station: Station) => void;
    setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentStation, setCurrentStation] = useState<Station>(STATIONS[0]);

    const togglePlay = () => setIsPlaying((prev) => !prev);
    const toggleMute = () => setIsMuted((prev) => !prev);
    const setStation = (station: Station) => {
        setCurrentStation(station);
        setIsPlaying(true); // Auto-play on station change
    };

    return (
        <MusicContext.Provider
            value={{
                isPlaying,
                isMuted,
                volume,
                currentStation,
                togglePlay,
                toggleMute,
                setVolume,
                setStation,
                setIsPlaying,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
};
