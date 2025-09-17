import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/components/ui/use-toast";

// Fetch function
const fetchPlant = async () => {
    const { data } = await apiClient.get('/plant/me');
    return data.data;
};

// Mutation function
const waterPlant = async () => {
    const { data } = await apiClient.post('/plant/water');
    return data.data;
};

function Plant() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Query to get plant data
    const { data: plant, isLoading, error } = useQuery({
        queryKey: ['plant', user._id],
        queryFn: fetchPlant,
    });

    // Mutation for watering the plant
    const mutation = useMutation({
        mutationFn: waterPlant,
        onSuccess: (updatedPlant) => {
            // Invalidate and refetch the plant data to update the UI
            queryClient.invalidateQueries(['plant', user._id]);
            toast({
                title: "Plant Watered! 💧",
                description: `Your plant's health has increased. You also earned some points!`,
            });
        },
        onError: (error) => {
            toast({
                title: "Uh oh!",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        }
    });

    if (isLoading) return <div>Loading Plant...</div>;
    if (error) return <div>Could not load plant data.</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Plant</CardTitle>
                <CardDescription>Keep your plant healthy by completing daily tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <img src="/plant-image-placeholder.png" alt="Your virtual plant" className="w-48 h-48" />
                <div className="w-full space-y-2">
                    <Label htmlFor="plant-health">Plant Health: {plant.health}%</Label>
                    <Progress id="plant-health" value={plant.health} className="w-full" />
                </div>
                <Button onClick={() => mutation.mutate()} disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Watering...' : 'Water Plant'}
                </Button>
            </CardContent>
        </Card>
    );
}

export default Plant;