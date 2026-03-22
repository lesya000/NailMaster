"use client";

import { submitBookingRequest, type BookingFormState } from "./actions";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initial: BookingFormState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
    >
      {pending ? "Отправка…" : "Отправить заявку"}
    </button>
  );
}

type BookingFormProps = {
  services: { id: string; name: string }[];
};

export function BookingForm({ services }: BookingFormProps) {
  const [state, formAction] = useActionState(submitBookingRequest, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
        <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100">{state.message}</p>
        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Имя
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          placeholder="Как к вам обращаться"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          placeholder="+7 …"
        />
      </div>

      <div>
        <label htmlFor="service_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Услуга
        </label>
        <select
          id="service_id"
          name="service_id"
          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          defaultValue=""
        >
          <option value="">Не выбрано</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="preferred_start"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Желаемая дата и время
        </label>
        <input
          id="preferred_start"
          name="preferred_start"
          type="datetime-local"
          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
        <p className="mt-1 text-xs text-zinc-500">Окончательное время согласуем по телефону.</p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Комментарий
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          placeholder="Пожелания по дизайну, аллергии…"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <Link
          href="/"
          className="text-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:text-left"
        >
          ← На главную
        </Link>
      </div>
    </form>
  );
}
