import React from 'react';
import useAppStore from '@/store/appStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

function TrackList() {
    const { playlist, playTrack, currentTrackIndex } = useAppStore();

    return (
        <div className="space-y-4">
            {playlist.map((track, index) => (
                // Added styles for the "frosted glass" effect
                <Card 
                    key={track.id} 
                    className="flex items-center p-4 bg-white/10 backdrop-blur-lg border-white/20 text-white"
                >
                    <img src={track.artwork} alt={track.title} className="w-16 h-16 rounded-md mr-4" />
                    <div className="flex-1">
                        <h3 className="font-semibold">{track.title}</h3>
                        <p className="text-sm text-gray-300">{track.artist}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => playTrack(index)}>
                        <PlayCircle className="w-8 h-8 text-white/80 hover:text-white" />
                    </Button>
                </Card>
            ))}
        </div>
    );
}

export default TrackList;