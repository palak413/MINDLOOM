import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

function JournalEntry({ entry }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{format(new Date(entry.createdAt), 'eeee, MMMM d, yyyy')}</CardTitle>
                <CardDescription>AI Detected Mood: {entry.mood}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
        </Card>
    );
}

export default JournalEntry;