import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fetchAllStoreItems = async () => {
    const { data } = await apiClient.get('/store');
    return data.data;
};

function Inventory() {
    const { user } = useAuth();
    const { data: allItems, isLoading } = useQuery({
        queryKey: ['storeItems'], // Reuse query key from store page
        queryFn: fetchAllStoreItems
    });

    if (isLoading) return <div>Loading inventory...</div>;

    const userInventoryIds = user?.inventory || [];
    const ownedItems = allItems.filter(item => userInventoryIds.includes(item._id));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Inventory</CardTitle>
            </CardHeader>
            <CardContent>
                {ownedItems.length === 0 ? (
                    <p className="text-gray-500">You haven't purchased any items yet. Visit the store to get some goodies!</p>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {ownedItems.map(item => (
                            <div key={item._id} className="flex flex-col items-center p-2 rounded-lg border text-center">
                                <img src={item.icon} alt={item.name} className="w-20 h-20 object-contain mb-2" />
                                <p className="text-sm font-semibold">{item.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default Inventory;