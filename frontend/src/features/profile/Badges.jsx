import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const fetchAllBadges = async () => {
    const { data } = await apiClient.get('/badges');
    return data.data;
};

function Badges() {
    const { user } = useAuth();
    const { data: allBadges, isLoading } = useQuery({
        queryKey: ['allBadges'],
        queryFn: fetchAllBadges
    });

    if (isLoading) return <div>Loading badges...</div>;

    const userBadgeIds = user?.badges || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Badge Collection</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    <TooltipProvider>
                        {allBadges.map(badge => {
                            const isOwned = userBadgeIds.includes(badge._id);
                            return (
                                <Tooltip key={badge._id}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "flex flex-col items-center p-2 rounded-lg border",
                                            isOwned ? "opacity-100" : "opacity-30 grayscale"
                                        )}>
                                            <img src={badge.icon} alt={badge.name} className="w-16 h-16" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{badge.name}</p>
                                        <p>{badge.description}</p>
                                        {!isOwned && <p className="text-xs text-gray-500">Earn {badge.pointsRequired} points to unlock.</p>}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}

export default Badges;