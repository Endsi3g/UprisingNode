"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api.service";
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    twoFactorEnabled?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const profile = await authService.getProfile();
                setUser(profile);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // If 401, usually the interceptor handles redirect, but we can clear state here
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem("token", token);
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push("/login");
    };

    const refetchProfile = async () => {
        await fetchProfile();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, refetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
