// ==============================================================================
// SATUDULU — Repository Factory
// Seamlessly routes to Supabase when configured & authenticated, or offline LocalStore
// ==============================================================================

import { IRepository } from "./interface";
import { LocalDemoRepository } from "./local-repo";
import { SupabaseRepository } from "./supabase-repo";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase/client";

let activeRepository: IRepository | null = null;
let currentMode: "supabase" | "local" | null = null;

function hasSupabaseSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed = JSON.parse(val);
          if (parsed && (parsed.user || parsed.access_token)) {
            return true;
          }
        }
      }
    }
  } catch {}
  return false;
}

export function getRepository(): IRepository {
  const isGuest =
    typeof window !== "undefined" &&
    localStorage.getItem("satudulu_guest_mode") === "true";

  const isAuthed = hasSupabaseSession();
  const desiredMode = isSupabaseConfigured && !isGuest && isAuthed ? "supabase" : "local";

  if (activeRepository && currentMode === desiredMode) {
    return activeRepository;
  }

  currentMode = desiredMode;
  if (desiredMode === "supabase") {
    const client = getSupabaseClient();
    if (client) {
      activeRepository = new SupabaseRepository(client);
      return activeRepository;
    }
  }

  activeRepository = new LocalDemoRepository();
  return activeRepository;
}

export function resetRepositoryToDemo(): IRepository {
  currentMode = "local";
  activeRepository = new LocalDemoRepository();
  return activeRepository;
}

export function clearRepositoryCache(): void {
  activeRepository = null;
  currentMode = null;
}
