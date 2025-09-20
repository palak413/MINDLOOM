import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Heart, Brain, Leaf, Sparkles, Shield, Lock } from 'lucide-react';
import MindloomLogo from '../components/icons/MindloomLogo';

function AuthPage() {
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

    // Sophisticated animation variants for perfect symmetry
    const pageVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.95,
            y: 30
        },
        visible: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.9,
            y: 40,
            rotateX: -10
        },
        visible: { 
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const logoVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.5,
            rotate: -180
        },
        visible: { 
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 1,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.3
            }
        }
    };

    const textVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: { 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const formVariants = {
        hidden: { 
            opacity: 0,
            y: 30
        },
        visible: { 
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1
            }
        }
    };

    const inputVariants = {
        hidden: { 
            opacity: 0,
            x: -20,
            scale: 0.95
        },
        visible: { 
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const buttonVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            y: 20
        },
        visible: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1]
            }
        },
        hover: { 
            scale: 1.05,
            y: -2,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        tap: { 
            scale: 0.95,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };

    const floatingVariants = {
        float: {
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
            {/* Sophisticated Background Pattern */}
            <div className="absolute inset-0">
                {/* Primary gradient with subtle animation */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50"
                    animate={{
                        background: [
                            "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0fdf4 100%)",
                            "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #f8fafc 100%)",
                            "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #e0f2fe 100%)",
                            "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0fdf4 100%)"
                        ]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                
                {/* Geometric patterns for depth */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-slate-300 rounded-full"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 border border-slate-300 rounded-full"></div>
                    <div className="absolute bottom-32 left-32 w-28 h-28 border border-slate-300 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-20 h-20 border border-slate-300 rounded-full"></div>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute top-24 left-24"
                >
                    <Heart className="w-8 h-8 text-emerald-300/40" />
                </motion.div>
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute top-32 right-28"
                    style={{ animationDelay: '1s' }}
                >
                    <Brain className="w-10 h-10 text-blue-300/40" />
                </motion.div>
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute bottom-28 left-28"
                    style={{ animationDelay: '2s' }}
                >
                    <Leaf className="w-9 h-9 text-green-300/40" />
                </motion.div>
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute bottom-24 right-24"
                    style={{ animationDelay: '3s' }}
                >
                    <Sparkles className="w-7 h-7 text-cyan-300/40" />
                </motion.div>
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute top-1/2 left-16"
                    style={{ animationDelay: '4s' }}
                >
                    <Shield className="w-6 h-6 text-slate-300/40" />
                </motion.div>
                <motion.div 
                    variants={floatingVariants}
                    animate="float"
                    className="absolute top-1/2 right-16"
                    style={{ animationDelay: '5s' }}
                >
                    <Lock className="w-6 h-6 text-slate-300/40" />
                </motion.div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg mx-auto flex justify-center"
                >
                    {/* Perfectly Centered Auth Card */}
                    <motion.div
                        variants={cardVariants}
                        className="relative w-full flex justify-center"
                    >
                        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden mx-auto w-full max-w-md">
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            
                            <CardContent className="p-10 relative">
                                {/* Logo Section - Perfectly Centered */}
                                <motion.div 
                                    variants={logoVariants}
                                    className="flex flex-col items-center justify-center mb-12 text-center"
                                >
                                    <div className="relative mb-6 flex justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl blur-xl"></div>
                                        <div className="relative bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl p-4 shadow-lg">
                                            <MindloomLogo className="w-20 h-20" color="#ffffff" />
                                        </div>
                                    </div>
                                    <motion.h1 
                                        variants={textVariants}
                                        className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-3 text-center"
                                    >
                                        Mindloom
                                    </motion.h1>
                                    <motion.p 
                                        variants={textVariants}
                                        className="text-slate-600 text-lg font-medium text-center max-w-sm leading-relaxed"
                                    >
                                        Your Journey to Mental Wellness
                                    </motion.p>
                                </motion.div>

                                {/* Tabs Section */}
                                <motion.div variants={formVariants} className="w-full flex justify-center">
                                    <Tabs defaultValue="login" className="w-full max-w-md">
                                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 backdrop-blur-sm rounded-2xl p-1">
                                            <TabsTrigger 
                                                value="login" 
                                                className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 transition-all duration-300 font-medium"
                                            >
                                                Sign In
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="register" 
                                                className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:rounded-xl data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 transition-all duration-300 font-medium"
                                            >
                                                Sign Up
                                            </TabsTrigger>
                </TabsList>
                                        
                                        {/* Login Tab */}
                <TabsContent value="login">
                                            <motion.form 
                                                onSubmit={handleLogin} 
                                                className="space-y-8"
                                                variants={formVariants}
                                            >
                                                <motion.div className="space-y-3" variants={inputVariants}>
                                                    <Label htmlFor="login-email" className="text-sm font-semibold text-slate-700">
                                                        Email Address
                                                    </Label>
                                                    <Input 
                                                        id="login-email" 
                                                        type="email" 
                                                        placeholder="Enter your email address" 
                                                        value={loginEmail} 
                                                        onChange={(e) => setLoginEmail(e.target.value)} 
                                                        required 
                                                        className="h-14 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl text-base"
                                                    />
                                                </motion.div>
                                                
                                                <motion.div className="space-y-3" variants={inputVariants}>
                                                    <Label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
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
                                                            className="h-14 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl text-base"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-100/50 rounded-lg"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-5 w-5 text-slate-400" />
                                                            ) : (
                                                                <Eye className="h-5 w-5 text-slate-400" />
                                                            )}
                                                        </Button>
                                </div>
                                                </motion.div>
                                                
                                                {error && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                                                    >
                                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                                    </motion.div>
                                                )}
                                                
                                                <motion.div variants={buttonVariants}>
                                                    <motion.div
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                    >
                                                        <Button 
                                                            type="submit" 
                                                            className="w-full h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                                                        >
                                                            Sign In
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            </motion.form>
                </TabsContent>

                                        {/* Register Tab */}
                <TabsContent value="register">
                                            <motion.form 
                                                onSubmit={handleRegister} 
                                                className="space-y-8"
                                                variants={formVariants}
                                            >
                                                <motion.div className="space-y-3" variants={inputVariants}>
                                                    <Label htmlFor="reg-username" className="text-sm font-semibold text-slate-700">
                                                        Username
                                                    </Label>
                                                    <Input 
                                                        id="reg-username" 
                                                        type="text" 
                                                        placeholder="Choose a username" 
                                                        value={regUsername} 
                                                        onChange={(e) => setRegUsername(e.target.value)} 
                                                        required 
                                                        className="h-14 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl text-base"
                                                    />
                                                </motion.div>
                                                
                                                <motion.div className="space-y-3" variants={inputVariants}>
                                                    <Label htmlFor="reg-email" className="text-sm font-semibold text-slate-700">
                                                        Email Address
                                                    </Label>
                                                    <Input 
                                                        id="reg-email" 
                                                        type="email" 
                                                        placeholder="Enter your email address" 
                                                        value={regEmail} 
                                                        onChange={(e) => setRegEmail(e.target.value)} 
                                                        required 
                                                        className="h-14 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl text-base"
                                                    />
                                                </motion.div>
                                                
                                                <motion.div className="space-y-3" variants={inputVariants}>
                                                    <Label htmlFor="reg-password" className="text-sm font-semibold text-slate-700">
                                                        Password
                                                    </Label>
                                                    <div className="relative">
                                                        <Input 
                                                            id="reg-password" 
                                                            type={showPassword ? "text" : "password"} 
                                                            placeholder="Create a secure password"
                                                            value={regPassword} 
                                                            onChange={(e) => setRegPassword(e.target.value)} 
                                                            required 
                                                            className="h-14 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 transition-all duration-300 bg-white/60 backdrop-blur-sm rounded-xl text-base"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-2 top-2 h-10 w-10 hover:bg-slate-100/50 rounded-lg"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-5 w-5 text-slate-400" />
                                                            ) : (
                                                                <Eye className="h-5 w-5 text-slate-400" />
                                                            )}
                                                        </Button>
                                </div>
                                                </motion.div>
                                                
                                                {error && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                                                    >
                                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                                    </motion.div>
                                                )}
                                                
                                                <motion.div variants={buttonVariants}>
                                                    <motion.div
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                    >
                                                        <Button 
                                                            type="submit" 
                                                            className="w-full h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                                                        >
                                                            Create Account
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            </motion.form>
                                        </TabsContent>
                                    </Tabs>
                                </motion.div>

                                {/* Footer Section */}
                                <motion.div 
                                    variants={textVariants}
                                    className="mt-10 text-center"
                                >
                                    <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                                        By continuing, you agree to our{' '}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200">
                                            Privacy Policy
                                        </a>
                                    </p>
                                </motion.div>
                        </CardContent>
                    </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default AuthPage;