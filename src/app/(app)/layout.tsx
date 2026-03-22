import { DashboardShell } from "@/components/dashboard-shell";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: "%s · NailMaster",
    default: "NailMaster",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
