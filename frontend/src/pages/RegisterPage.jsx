import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/axios';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await apiClient.post('/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };
    
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Create Your Mindloom Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input className="w-full px-4 py-2 border rounded-md" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <input className="w-full px-4 py-2 border rounded-md" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input className="w-full px-4 py-2 border rounded-md" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit" className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">Create Account</button>
                </form>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className="text-center">Already have an account? <Link to="/login" className="text-green-500 hover:underline">Sign In</Link></p>
            </div>
        </div>
    );
}

export default RegisterPage;