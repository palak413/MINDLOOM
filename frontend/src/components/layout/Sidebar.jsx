import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { Home, BookOpen, Store, Music, MessageSquare, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Standard navigation links for all users
const navLinks = [
    { to: "/", icon: Home, text: "Dashboard" },
    { to: "/journal", icon: BookOpen, text: "Journal" },
    { to: "/store", icon: Store, text: "Store" },
    { to: "/meditation", icon: Music, text: "Music" },
    { to: "/chat", icon: MessageSquare, text: "Chat" },
    { to: "/profile", icon: User, text: "Profile" },
];

function Sidebar() {
    const { user } = useAuth(); // Get the current user from the context

    return (
        <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-gray-200 flex-col">
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Mindloom</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/"} // Ensures only the Dashboard link is active on the home page
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors",
                                isActive && "bg-green-100 text-green-700 font-semibold"
                            )
                        }
                    >
                        <link.icon className="w-5 h-5 mr-3" />
                        {link.text}
                    </NavLink>
                ))}
                
                {/* Conditionally render the Admin link only if the user's role is 'admin' */}
                {user?.role === 'admin' && (
                    <>
                        <hr className="my-4 border-gray-200" />
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors",
                                    isActive && "bg-indigo-100 text-indigo-700 font-semibold"
                                )
                            }
                        >
                            <ShieldCheck className="w-5 h-5 mr-3" />
                            Admin Panel
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;