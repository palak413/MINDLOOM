import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

function JournalList({ entries, setSelectedEntry, selectedEntry, setNewEntryMode }) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Your Entries</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setNewEntryMode(true)}>
                        + New Entry
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh]">
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div
                                key={entry._id}
                                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedEntry?._id === entry._id ? 'bg-green-50 border-green-200' : ''}`}
                                onClick={() => setSelectedEntry(entry)}
                            >
                                <p className="font-semibold text-sm">{format(new Date(entry.createdAt), 'MMMM d, yyyy')}</p>
                                <p className="text-xs text-gray-500">Mood: {entry.mood}</p>
                                <p className="text-sm text-gray-700 mt-2 truncate">
                                    {entry.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default JournalList;