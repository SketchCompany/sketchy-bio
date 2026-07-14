"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@prisma/client";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { THEME_TOKENS, DEFAULT_THEME, resolveTheme, type Theme } from "@/lib/theme";
import { updateTheme } from "@/lib/actions";

export function ThemeEditor({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>(resolveTheme(profile?.theme));
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string) => setTheme((t) => ({ ...t, [key]: value }));

  async function save() {
    setSaving(true);
    try {
      await updateTheme(theme);
      toast.success("Colours saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Colours</h2>
            <p className="text-sm text-muted-foreground">Applied to the public page after saving.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setTheme({ ...DEFAULT_THEME })}>
              <RotateCcw className="mr-1.5 size-4" /> Reset
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save colours"}</Button>
          </div>
        </div>

        <div className="space-y-3">
          {THEME_TOKENS.map((t) => (
            <div key={t.key} className="flex items-center gap-3">
              <input
                type="color"
                aria-label={t.label}
                value={theme[t.key]}
                onChange={(e) => set(t.key, e.target.value)}
                className="size-9 shrink-0 cursor-pointer rounded border border-border bg-transparent"
              />
              <Label className="w-32 shrink-0">{t.label}</Label>
              <Input
                value={theme[t.key]}
                onChange={(e) => set(t.key, e.target.value)}
                className="max-w-[130px] font-mono text-xs uppercase"
              />
            </div>
          ))}
        </div>

        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save colours"}</Button>
      </div>

      {/* live preview */}
      <div>
        <Label className="mb-2 block">Preview</Label>
        <div
          className="space-y-3 rounded-xl border border-border p-5"
          style={{ background: theme.background, color: theme.text }}
        >
          <div style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: theme.pink }}>
            Producer · Artist
          </div>
          <div style={{ fontSize: 26, fontFamily: "var(--font-display), serif" }}>Sketchy</div>
          <div style={{ color: theme.muted, fontSize: 13 }}>
            Late-night beats, blown-out drums and tape hiss.
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div
              style={{
                borderRadius: 8,
                padding: 12,
                minHeight: 74,
                border: `1px solid ${theme.pink}55`,
                background: `linear-gradient(150deg, ${theme.violet}3a, ${theme.surface})`,
              }}
            >
              <div style={{ fontSize: 11, color: theme.muted }}>Spotify</div>
              <div style={{ fontFamily: "var(--font-display), serif", fontSize: 18 }}>Latest drop</div>
            </div>
            <div style={{ borderRadius: 8, padding: 12, minHeight: 74, background: theme.surface, border: `1px solid ${theme.text}18` }}>
              <div style={{ fontSize: 11, color: theme.muted }}>Link</div>
              <div style={{ fontFamily: "var(--font-display), serif", fontSize: 18 }}>Merch</div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <span style={{ background: theme.pink, color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>Accent</span>
            <span style={{ background: theme.pinkDeep, color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>Deep</span>
            <span style={{ background: theme.edge, color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>Edge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
