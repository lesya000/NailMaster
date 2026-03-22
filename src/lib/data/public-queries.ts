import { createPublicClient } from "@/lib/supabase/public";
import type { PortfolioItem, Profile, Service } from "./types";

export async function getSalonProfile(): Promise<Profile | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
  if (error) {
    console.error("getSalonProfile", error.message);
    return null;
  }
  return data as Profile | null;
}

export async function getPublicServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getPublicServices", error.message);
    return [];
  }
  return (data ?? []) as Service[];
}

export async function getPublicPortfolio(limit = 6): Promise<PortfolioItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getPublicPortfolio", error.message);
    return [];
  }
  return (data ?? []) as PortfolioItem[];
}
