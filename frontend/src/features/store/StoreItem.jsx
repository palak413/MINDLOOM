import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function StoreItem({ item, userPoints, onBuy, isOwned }) {
    const canAfford = userPoints >= item.cost;

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <img src={item.icon} alt={item.name} className="w-full h-40 object-cover rounded-md bg-gray-100" />
            </CardHeader>
            <CardContent className="flex-1">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="mt-2 text-sm">{item.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4">
                <div className="font-bold text-lg text-green-600">🏆 {item.cost} Points</div>
                {isOwned ? (
                    <Badge variant="secondary">Owned</Badge>
                ) : (
                    <Button onClick={() => onBuy(item)} disabled={!canAfford}>
                        {canAfford ? 'Buy' : 'Not Enough Points'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default StoreItem;