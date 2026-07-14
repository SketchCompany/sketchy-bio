import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Dashboard } from "@/components/admin/Dashboard";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [profile, tiles, legal] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.bentoGridItem.findMany({ orderBy: { order: "asc" } }),
    prisma.legalPage.findMany(),
  ]);
  // Present the legal pages in a stable, sensible order.
  const legalOrder = ["impressum", "datenschutz", "agb"];
  const legalPages = [...legal].sort(
    (a, b) => legalOrder.indexOf(a.slug) - legalOrder.indexOf(b.slug),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile?.artistName?.trim() ? `${profile.artistName.trim()} Admin` : "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">Manage your link-in-bio page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ExternalLink className="mr-1.5 size-4" /> View page
          </Link>
          <SignOutButton />
        </div>
      </header>

      <Dashboard profile={profile} tiles={tiles} legalPages={legalPages} />
    </div>
  );
}
