import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

// The admin area must never be indexed by search engines.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-dvh bg-background text-foreground">
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
