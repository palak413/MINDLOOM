import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Badges from '../features/profile/Badges';
import Inventory from '../features/profile/Inventory';

function ProfilePage() {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Your Profile</h1>
                <p className="text-gray-600">View your stats, achievements, and goodies.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Details</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="font-semibold">Username:</span>
                                <span>{user?.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Email:</span>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Total Points:</span>
                                <span>🏆 {user?.points}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Current Streak:</span>
                                <span>🔥 {user?.currentStreak} days</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="badges" className="mt-4">
                    <Badges />
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-4">
                    <Inventory />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfilePage;