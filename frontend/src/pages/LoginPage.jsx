import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Heart, Brain, Leaf, Sparkles } from 'lucide-react';
import MindloomLogo from '../components/MindloomLogo';

function LoginPage() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // Login logic will be implemented later
        console.log('Login attempt:', { email: loginEmail, password: loginPassword });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        // Registration logic will be implemented later
        console.log('Register attempt:', { username: regUsername, email: regEmail, password: regPassword });
    };
    
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 animate-float">
                    <Heart className="w-6 h-6 text-emerald-300/60" />
                </div>
                <div className="absolute top-32 right-32 animate-float-delay-1">
                    <Brain className="w-8 h-8 text-teal-300/60" />
                </div>
                <div className="absolute bottom-32 left-32 animate-float-delay-2">
                    <Leaf className="w-7 h-7 text-green-300/60" />
                </div>
                <div className="absolute bottom-20 right-20 animate-float-delay-3">
                    <Sparkles className="w-6 h-6 text-cyan-300/60" />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4 logo-container">
                        <MindloomLogo className="w-12 h-12" color="#ffffff" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        Mindloom
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Your Journey to Mental Wellness
                    </p>
                </div>

                {/* Login/Register Card */}
                <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-semibold text-gray-800">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to continue your wellness journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Sign In
                                </TabsTrigger>
                                <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>
                            
                            {/* Login Tab */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <Input 
                                            id="login-email" 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            value={loginEmail} 
                                            onChange={(e) => setLoginEmail(e.target.value)} 
                                            required 
                                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 input-focus"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input 
                                                id="login-password" 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="Enter your password"
                                                value={loginPassword} 
                                                onChange={(e) => setLoginPassword(e.target.value)} 
                                                required 
                                                className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 input-focus"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 btn-gradient text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Sign In
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Register Tab */}
                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-username" className="text-sm font-medium text-gray-700">
                                            Username
                                        </Label>
                                        <Input 
                                            id="reg-username" 
                                            type="text" 
                                            placeholder="Choose a username" 
                                            value={regUsername} 
                                            onChange={(e) => setRegUsername(e.target.value)} 
                                            required 
                                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 input-focus"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <Input 
                                            id="reg-email" 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            value={regEmail} 
                                            onChange={(e) => setRegEmail(e.target.value)} 
                                            required 
                                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 input-focus"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input 
                                                id="reg-password" 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="Create a password"
                                                value={regPassword} 
                                                onChange={(e) => setRegPassword(e.target.value)} 
                                                required 
                                                className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10 input-focus"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-600">{error}</p>
                    </div>
                                    )}
                                    <Button 
                                        type="submit" 
                                        className="w-full h-12 btn-gradient text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Create Account
                                    </Button>
                </form>
                            </TabsContent>
                        </Tabs>

                        {/* Additional Info */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2024 Mindloom. Nurturing minds, one day at a time.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;