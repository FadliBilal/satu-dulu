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
    password: string,
    username?: string
  ) => Promise<{ error: Error | null; user: User | null; session: Session | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
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

    // Check if URL hash or search contains recovery tokens or recovery errors when not on /reset-password
    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      if (
        (hash.includes("type=recovery") ||
          search.includes("type=recovery") ||
          hash.includes("error_code=") ||
          search.includes("error_code=")) &&
        window.location.pathname !== "/reset-password"
      ) {
        window.location.replace(`/reset-password${search}${hash}`);
        return;
      }
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

    // 2. Listen to auth state changes (login, logout, token refresh, password recovery)
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, updatedSession) => {
        if (event === "PASSWORD_RECOVERY") {
          if (typeof window !== "undefined" && window.location.pathname !== "/reset-password") {
            window.location.replace(`/reset-password${window.location.search}${window.location.hash}`);
            return;
          }
        }
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

  const signUpWithPassword = async (email: string, password: string, username?: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi."), user: null, session: null };
    }
    const cleanUsername = username?.trim().toLowerCase();
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/app`,
        data: {
          username: cleanUsername || email.split("@")[0],
        },
      },
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

  const resetPasswordForEmail = async (email: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi.") };
    }
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const redirectTo = `${origin}/reset-password`;
    const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi.") };
    }
    const { error } = await client.auth.updateUser({ password: newPassword });
    return { error };
  };

  const deleteAccount = async () => {
    if (isGuest || !user) {
      // Guest mode deletion: clear local demo data and reset
      if (typeof window !== "undefined") {
        localStorage.removeItem("satudulu_data_v2");
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
      setIsGuest(false);
      setUser(null);
      setSession(null);
      clearRepositoryCache();
      return { error: null };
    }

    const client = getSupabaseClient();
    if (!client) {
      return { error: new Error("Supabase belum dikonfigurasi.") };
    }

    try {
      // 1. Attempt server-side RPC function delete_user_account()
      const { error: rpcError } = await client.rpc("delete_user_account");
      if (rpcError) {
        console.warn("RPC delete_user_account error, executing client cascade delete:", rpcError);
        // Fallback: Delete rows from user-scoped tables
        const userId = user.id;
        await client.from("task_events").delete().eq("user_id", userId);
        await client.from("focus_sessions").delete().eq("user_id", userId);
        await client.from("daily_reflections").delete().eq("user_id", userId);
        await client.from("commitments").delete().eq("user_id", userId);
        await client.from("daily_plans").delete().eq("user_id", userId);
        await client.from("inbox_items").delete().eq("user_id", userId);
        await client.from("profiles").delete().eq("user_id", userId);
      }
    } catch (err) {
      console.warn("Error cleaning up user data:", err);
    }

    // 2. Sign out the user
    await signOut();
    return { error: null };
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
        resetPasswordForEmail,
        updatePassword,
        deleteAccount,
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
