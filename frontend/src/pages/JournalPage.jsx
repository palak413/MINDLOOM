import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { useSocket } from '../context/SocketProvider';
import { useToast } from "@/components/ui/use-toast";
import JournalList from '../features/journal/JournalList';
import JournalEntry from '../features/journal/JournalEntry';
import JournalForm from '../features/journal/JournalForm';
import { Card, CardContent } from '@/components/ui/card';


const fetchJournals = async () => {
    const { data } = await apiClient.get('/journal');
    return data.data;
};

function JournalPage() {
    const { user } = useAuth();
    const socket = useSocket();
    const { toast } = useToast();
    
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [newEntryMode, setNewEntryMode] = useState(true);

    const { data: entries, isLoading, error } = useQuery({
        queryKey: ['journals', user._id],
        queryFn: fetchJournals,
    });

    useEffect(() => {
        if (!socket) return;
        
        const handleDistortion = (data) => {
            toast({
                title: "💡 An Insight Was Found!",
                description: data.message,
                duration: 9000,
            });
        };

        socket.on('distortion_detected', handleDistortion);
        return () => socket.off('distortion_detected', handleDistortion);
    }, [socket, toast]);

    const handleSelectEntry = (entry) => {
        setSelectedEntry(entry);
        setNewEntryMode(false);
    };

    const handleSaveNewEntry = (newEntry) => {
        setSelectedEntry(newEntry);
        setNewEntryMode(false);
    }
    
    if (isLoading) return <div>Loading your journal...</div>;
    if (error) return <div>Could not load your journal.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            <div className="md:col-span-1">
                <JournalList 
                    entries={entries} 
                    selectedEntry={selectedEntry}
                    setSelectedEntry={handleSelectEntry}
                    setNewEntryMode={setNewEntryMode}
                />
            </div>
            <div className="md:col-span-2">
                {newEntryMode ? (
                    <JournalForm onSave={handleSaveNewEntry} />
                ) : selectedEntry ? (
                    <JournalEntry entry={selectedEntry} />
                ) : (
                    <Card className="flex items-center justify-center h-full">
                        <CardContent className="text-center text-gray-500">
                            <p>Select an entry from the left to read it,</p>
                            <p>or create a new one.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default JournalPage;