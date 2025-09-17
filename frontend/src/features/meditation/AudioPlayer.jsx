import React, { useEffect, useRef } from 'react';
import useAppStore from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

function AudioPlayer() {
    const { playlist, currentTrackIndex, isPlaying, togglePlay, nextTrack, prevTrack } = useAppStore();
    const audioRef = useRef(null);
    const [progress, setProgress] = React.useState(0);
    
    const currentTrack = currentTrackIndex > -1 ? playlist[currentTrackIndex] : null;

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    const handleTimeUpdate = () => {
        const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percentage);
    };
    
    const handleSeek = (value) => {
        audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    };

    if (currentTrackIndex === -1) {
        return null; // Don't render the player if no track is selected
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 z-50 flex items-center px-6">
            <audio
                ref={audioRef}
                src={currentTrack.src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextTrack}
                key={currentTrack.id} // Important to re-render the audio element on track change
            />
            <div className="flex items-center space-x-4">
                <img src={currentTrack.artwork} alt={currentTrack.title} className="w-12 h-12 rounded-md" />
                <div>
                    <h3 className="font-semibold text-sm">{currentTrack.title}</h3>
                    <p className="text-xs text-gray-500">{currentTrack.artist}</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon" onClick={prevTrack}><SkipBack /></Button>
                <Button variant="default" size="icon" onClick={togglePlay} className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600">
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button variant="ghost" size="icon" onClick={nextTrack}><SkipForward /></Button>
            </div>
            <div className="w-1/3">
                <Slider value={[progress]} onValueChange={(value) => handleSeek(value[0])} />
            </div>
        </div>
    );
}

export default AudioPlayer;