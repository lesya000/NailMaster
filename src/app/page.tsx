import { LandingView } from "@/components/public/landing-view";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Запись на маникюр",
  description: "Услуги, расписание, портфолио и онлайн-запись",
};

export default function HomePage() {
  return <LandingView />;
}
