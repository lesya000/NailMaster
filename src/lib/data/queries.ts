import { createClient } from "@/lib/supabase/server";
import type {
  Appointment,
  Client,
  PortfolioItem,
  Profile,
  Service,
} from "./types";

/**
 * Заготовки запросов к Supabase. Раскомментируйте реализацию после настройки auth и RLS.
 */

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getProfile", error.message);
    return null;
  }
  return data as Profile | null;
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getClients", error.message);
    return [];
  }
  return (data ?? []) as Client[];
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getServices", error.message);
    return [];
  }
  return (data ?? []) as Service[];
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("getAppointments", error.message);
    return [];
  }
  return (data ?? []) as Appointment[];
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getPortfolioItems", error.message);
    return [];
  }
  return (data ?? []) as PortfolioItem[];
}
