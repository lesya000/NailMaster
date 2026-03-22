/** Типы таблиц public.* (см. supabase/migrations). */

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  salon_name: string | null;
  city: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  master_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  allergy_notes: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  master_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  master_id: string;
  client_id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_cents: number;
  created_at: string;
  updated_at: string;
};

export type AppointmentService = {
  id: string;
  appointment_id: string;
  service_id: string;
  quantity: number;
  price_cents_at_booking: number;
  created_at: string;
};

export type PortfolioItem = {
  id: string;
  master_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};
