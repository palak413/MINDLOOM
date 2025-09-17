import React, { useEffect } from 'react';
import Plant from '../features/dashboard/Plant';
import DailyTasks from '../features/dashboard/DailyTasks';
import { useSocket } from '../context/SocketProvider';
import { useToast } from "@/components/ui/use-toast";

function DashboardPage() {
    const socket = useSocket();
    const { toast } = useToast();

    // Effect for listening to real-time socket events
    useEffect(() => {
        if (!socket) return;

        const handleNewBadge = (data) => {
            toast({
                title: "🏆 New Badge Unlocked!",
                description: `You've earned the "${data.name}" badge. Check your profile!`,
            });
        };
        
        socket.on('new_badge', handleNewBadge);

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('new_badge', handleNewBadge);
        };
    }, [socket, toast]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plant component takes up 2/3 of the space on larger screens */}
            <div className="md:col-span-2">
                <Plant />
            </div>

            {/* Daily Tasks component takes up 1/3 of the space */}
            <div className="md:col-span-1">
                <DailyTasks />
            </div>
        </div>
    );
}

export default DashboardPage;