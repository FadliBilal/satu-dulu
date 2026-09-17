// ==============================================================================
// SATUDULU — Repository Factory
// Seamlessly routes to Supabase when configured, or offline LocalStore
// ==============================================================================

import { IRepository } from "./interface";
import { LocalDemoRepository } from "./local-repo";
import { SupabaseRepository } from "./supabase-repo";
import { getSupabaseClient, isSupabaseConfigured } from "../supabase/client";

let activeRepository: IRepository | null = null;

export function getRepository(): IRepository {
  if (!activeRepository) {
    const client = getSupabaseClient();
    if (isSupabaseConfigured && client) {
      activeRepository = new SupabaseRepository(client);
    } else {
      activeRepository = new LocalDemoRepository();
    }
  }
  return activeRepository;
}

export function resetRepositoryToDemo(): IRepository {
  activeRepository = new LocalDemoRepository();
  return activeRepository;
}
