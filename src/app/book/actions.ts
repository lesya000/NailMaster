"use server";

import { createPublicClient } from "@/lib/supabase/public";

export type BookingFormState = {
  ok: boolean;
  message: string;
};

export async function submitBookingRequest(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const preferredRaw = String(formData.get("preferred_start") ?? "").trim();
  const serviceRaw = String(formData.get("service_id") ?? "").trim();

  if (name.length < 2) {
    return { ok: false, message: "Укажите имя (не короче 2 символов)." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false, message: "Укажите корректный номер телефона." };
  }

  let preferredStart: string | null = null;
  if (preferredRaw) {
    const d = new Date(preferredRaw);
    if (Number.isNaN(d.getTime())) {
      return { ok: false, message: "Некорректная дата и время." };
    }
    preferredStart = d.toISOString();
  }

  const supabase = createPublicClient();
  const payload = {
    name,
    phone,
    notes: notes || null,
    preferred_start: preferredStart,
    service_id: serviceRaw.length > 0 ? serviceRaw : null,
  };

  const { error } = await supabase.from("booking_requests").insert(payload);

  if (error) {
    console.error("submitBookingRequest", error.message);
    return {
      ok: false,
      message:
        "Не удалось отправить заявку. Проверьте, что в Supabase применена миграция с таблицей booking_requests.",
    };
  }

  return {
    ok: true,
    message: "Заявка отправлена. Мастер свяжется с вами для подтверждения времени.",
  };
}
