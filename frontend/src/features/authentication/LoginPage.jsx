import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/axios';
import { AuthContext } from '../context/AuthProvider';
import { Button } from "@/components/ui/button"; // Shadcn component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn component
import { Input } from "@/components/ui/input"; // Shadcn component
import { Label } from "@/components/ui/label"; // Shadcn component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Shadcn component

// Note: We are combining Login and Register into one component for a better UX
function AuthPage() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // State for Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // State for Register
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiClient.post('/auth/login', { email: loginEmail, password: loginPassword });
            login(response.data.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await apiClient.post('/auth/register', { username: regUsername, email: regEmail, password: regPassword });
            // Switch to the login tab after successful registration
            // You can also show a success message
            navigate(0); // This is a simple way to refresh to the login tab state
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542601906-82387259b5ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back to Mindloom</CardTitle>
                            <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Sign In</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create your Mindloom Account</CardTitle>
                            <CardDescription>Start your wellness journey today.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reg-username">Username</Label>
                                    <Input id="reg-username" type="text" placeholder="Your Username" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input id="reg-email" type="email" placeholder="you@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Password</Label>
                                    <Input id="reg-password" type="password" placeholder="Create a password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Create Account</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Since this component now handles both Login and Register, we can simplify our files.
// You can rename this file to `AuthPage.jsx`
export default AuthPage;