import React, { createContext, useContext, useState, ReactNode } from "react";

export type Station = {
    id: string;
    name: string;
    url: string;
    type: "playlist" | "live" | "track";
};

export const STATIONS: Station[] = [
    {
        id: "classical-venice",
        name: "Classical Radio",
        url: "https://uk2.streamingpulse.com/ssl/vcr2",
        type: "track",
    },
    {
        id: "jazz-wrti",
        name: "Jazz FM",
        url: "https://wrti-live.streamguys1.com/jazz-mp3",
        type: "track",
    },
    {
        id: "lofi-chillhop",
        name: "Lofi Hip Hop",
        url: "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/",
        type: "track",
    },

    {
        id: "reggae-joint",
        name: "Reggae Trade (1.FM)",
        url: "https://strm112.1.fm/reggae_mobile_mp3",
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

    // Initialize from localStorage or default
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem("music_muted");
        return saved ? JSON.parse(saved) : false;
    });

    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem("music_volume");
        return saved ? parseFloat(saved) : 0.5;
    });

    const [currentStation, setCurrentStation] = useState<Station>(() => {
        const saved = localStorage.getItem("music_station_id");
        return STATIONS.find(s => s.id === saved) || STATIONS[0];
    });

    // Persistence Effects
    React.useEffect(() => {
        localStorage.setItem("music_muted", JSON.stringify(isMuted));
    }, [isMuted]);

    React.useEffect(() => {
        localStorage.setItem("music_volume", volume.toString());
    }, [volume]);

    React.useEffect(() => {
        localStorage.setItem("music_station_id", currentStation.id);
    }, [currentStation]);

    const togglePlay = () => setIsPlaying((prev) => !prev);
    const toggleMute = () => setIsMuted((prev: boolean) => !prev);
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
