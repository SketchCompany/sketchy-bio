"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LegalPage } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateLegalPage } from "@/lib/actions";

function PageForm({ page }: { page: LegalPage }) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await updateLegalPage(page.slug, { title, content });
      toast.success(`${page.title} gespeichert`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium">/{page.slug}</h3>
        <div className="flex items-center gap-3">
          <a
            href={`/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline"
          >
            <ExternalLink className="size-3" /> Ansehen
          </a>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? "Speichern…" : "Speichern"}</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Titel</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Inhalt (Markdown)</Label>
        <Textarea
          className="max-h-[420px] min-h-[220px] overflow-y-auto font-mono text-xs"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <Button onClick={save} disabled={saving}>{saving ? "Speichern…" : "Speichern"}</Button>
    </div>
  );
}

export function LegalEditor({ pages }: { pages: LegalPage[] }) {
  return (
    <div className="max-w-3xl space-y-5">
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
        Diese Texte sind automatisch erstellte, unverbindliche Vorlagen. Trage im Impressum deine
        echten Daten ein und lass die Seiten im Zweifel rechtlich prüfen. Das ist keine
        Rechtsberatung.
      </div>
      {pages.map((page) => (
        <PageForm key={page.id} page={page} />
      ))}
    </div>
  );
}
