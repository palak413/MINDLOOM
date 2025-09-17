import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Compass } from 'lucide-react';

function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <Compass className="w-24 h-24 text-green-300 mb-4" />
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mt-2">Page Not Found</h2>
            <p className="text-gray-500 mt-4 max-w-sm">
                Oops! It seems you've wandered off the path. The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="mt-8 bg-green-500 hover:bg-green-600">
                <Link to="/">Go Back to Dashboard</Link>
            </Button>
        </div>
    );
}

export default NotFoundPage;