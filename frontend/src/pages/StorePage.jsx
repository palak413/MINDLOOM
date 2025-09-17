import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from "@/components/ui/use-toast";
import StoreItem from '../features/store/StoreItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// API Functions
const fetchStoreItems = async () => {
    const { data } = await apiClient.get('/store');
    return data.data;
};

const buyStoreItem = async (itemId) => {
    const { data } = await apiClient.post(`/store/${itemId}/buy`);
    return data.data;
};

function StorePage() {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: items, isLoading, error } = useQuery({
        queryKey: ['storeItems'],
        queryFn: fetchStoreItems,
    });

    const mutation = useMutation({
        mutationFn: buyStoreItem,
        onSuccess: (data) => {
            updateUser({ points: data.points, inventory: [...user.inventory, selectedItem._id] });
            toast({
                title: "Purchase Successful! 🎉",
                description: `You've bought "${selectedItem.name}". Check your profile to see your inventory.`,
            });
            setIsDialogOpen(false);
            setSelectedItem(null);
        },
        onError: (error) => {
            toast({
                title: "Purchase Failed",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
            setIsDialogOpen(false);
        }
    });

    const handleBuyClick = (item) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleConfirmPurchase = () => {
        if (selectedItem) {
            mutation.mutate(selectedItem._id);
        }
    };

    if (isLoading) return <div>Loading Store...</div>;
    if (error) return <div>Could not load store items.</div>;

    const userInventory = user?.inventory || [];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Point Store</h1>
            <p className="text-gray-600 mb-6">Spend your earned points on these exclusive goodies!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <StoreItem 
                        key={item._id}
                        item={item}
                        userPoints={user?.points}
                        isOwned={userInventory.includes(item._id)}
                        onBuy={handleBuyClick}
                    />
                ))}
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to buy "{selectedItem?.name}" for 🏆 {selectedItem?.cost} points? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmPurchase} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Processing...' : 'Confirm'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default StorePage;