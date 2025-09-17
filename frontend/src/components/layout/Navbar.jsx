import React from 'react';
import { useAuth } from '@/context/AuthProvider';
import useAppStore from '@/store/appStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

function Navbar() {
    const { user, logout } = useAuth();
    const { points, streak } = useAppStore();

    // Use user data from AuthContext first, then fallback to Zustand store
    const displayPoints = user?.points ?? points;
    const displayStreak = user?.currentStreak ?? streak;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
            <div className="flex items-center space-x-6">
                <div className="text-sm font-semibold text-gray-700">🏆 {displayPoints} Points</div>
                <div className="text-sm font-semibold text-gray-700">🔥 {displayStreak} Day Streak</div>
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt={user?.username} />
                        <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-800">{user?.username}</p>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                    <LogOut className="w-5 h-5 text-gray-600" />
                </Button>
            </div>
        </header>
    );
}

export default Navbar;