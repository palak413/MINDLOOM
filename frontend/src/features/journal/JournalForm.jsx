import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const createEntry = async (content) => {
    const { data } = await apiClient.post('/journal', { content });
    return data.data;
};

function JournalForm({ onSave }) {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: createEntry,
        onSuccess: (newEntry) => {
            queryClient.invalidateQueries(['journals', user._id]);
            toast({
                title: "Entry Saved! ✨",
                description: "Your thoughts have been saved.",
            });
            setContent('');
            onSave(newEntry); // Callback to update the parent component's view
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Could not save entry.",
                variant: "destructive",
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            mutation.mutate(content);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Journal Entry</CardTitle>
                <CardDescription>What's on your mind today? Your thoughts are safe here.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing..."
                        className="min-h-[40vh]"
                    />
                    <Button type="submit" className="mt-4 bg-green-500 hover:bg-green-600" disabled={mutation.isLoading}>
                        {mutation.isLoading ? 'Saving...' : 'Save Entry'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default JournalForm;