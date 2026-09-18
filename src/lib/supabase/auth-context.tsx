"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "./client";
import { clearRepositoryCache } from "@/lib/repository";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isGuest: boolean;
  isSupabaseEnabled: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; user: User | null; session: Session | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "satudulu_guest_mode";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    // Check if guest mode was previously selected
    if (typeof window !== "undefined") {
      const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
      if (storedGuest === "true") {
        setIsGuest(true);
      }
    }

    if (!isSupabaseConfigured) {
      // If Supabase is not configured, automatically act as guest/demo
      setIsGuest(true);
      setIsLoading(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setIsLoading(false);
      return;
    }

    // 1. Initial session load
    client.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsGuest(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    // 2. Listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, updatedSession) => {
        setSession(updatedSession);
        setUser(updatedSession?.user ?? null);
        if (updatedSession?.user) {
          setIsGuest(false);
          if (typeof window !== "undefined") {
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi.") };
    }
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      setIsGuest(false);
      clearRepositoryCache();
      if (typeof window !== "undefined") {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
    }

    return { error };
  };

  const signUpWithPassword = async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi."), user: null, session: null };
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      if (data.session) {
        setIsGuest(false);
        clearRepositoryCache();
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
      }
    }

    return { error, user: data.user, session: data.session };
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsGuest(false);
    clearRepositoryCache();
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_STORAGE_KEY, "true");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isGuest,
        isSupabaseEnabled: isSupabaseConfigured,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
