import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const fetchTasks = async () => {
    const { data } = await apiClient.get('/tasks');
    return data.data;
};

const completeTask = async (taskId) => {
    const { data } = await apiClient.post(`/tasks/${taskId}/complete`);
    return data.data;
};

function DailyTasks() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks', user._id],
        queryFn: fetchTasks,
    });

    const mutation = useMutation({
        mutationFn: completeTask,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', user._id]);
            toast({
                title: "Task Completed! ✨",
                description: "Great job! You've earned points.",
            });
        },
        onError: (error) => {
             toast({
                title: "Oops!",
                description: error.response?.data?.message || "Could not complete task.",
                variant: "destructive",
            });
        }
    });
    
    if (isLoading) return <div>Loading tasks...</div>;
    if (error) return <div>Could not load tasks.</div>;

    const pendingTasks = tasks.filter(task => !task.isCompleted);
    const completedTasks = tasks.filter(task => task.isCompleted);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Goals</CardTitle>
                <CardDescription>Complete these tasks to earn points and grow your plant.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingTasks.map((task) => (
                        <div key={task._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                            <Checkbox 
                                id={task._id} 
                                onCheckedChange={() => mutation.mutate(task._id)}
                                disabled={mutation.isLoading}
                            />
                            <label htmlFor={task._id} className="flex-1 text-sm font-medium text-gray-800">
                                {task.description}
                            </label>
                            <span className="text-sm font-bold text-green-600">+{task.points} pts</span>
                        </div>
                    ))}
                    {completedTasks.map((task) => (
                         <div key={task._id} className="flex items-center space-x-3 p-3 rounded-md opacity-50">
                            <Checkbox id={task._id} checked={true} disabled />
                            <label htmlFor={task._id} className="flex-1 text-sm font-medium text-gray-500 line-through">
                                {task.description}
                            </label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default DailyTasks;