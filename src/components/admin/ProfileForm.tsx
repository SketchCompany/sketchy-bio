"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@prisma/client";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UploadField } from "./UploadField";
import { updateProfile } from "@/lib/actions";
import { resolveTicker } from "@/lib/homepage";

type Social = { label: string; url: string; icon?: string };

const ICONS = ["link", "instagram", "tiktok", "youtube", "spotify", "apple", "soundcloud", "bandcamp", "discord", "mail", "calendar", "bag", "music"];

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [artistName, setArtistName] = useState(profile?.artistName ?? "Sketchy");
  const [heroKicker, setHeroKicker] = useState(profile?.heroKicker ?? "Producer · Artist");
  const [tagline, setTagline] = useState(profile?.tagline ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(profile?.logoUrl ?? null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatarUrl ?? null);
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(profile?.ogImageUrl ?? null);
  const [social, setSocial] = useState<Social[]>(
    (profile?.socialLinks as Social[] | null) ?? [],
  );
  const [topLeft, setTopLeft] = useState(profile?.topLeft ?? "Self-hosted");
  const [topRight, setTopRight] = useState(profile?.topRight ?? "Transmission 001");
  const initialTicker = resolveTicker(profile?.ticker);
  const [tickerEnabled, setTickerEnabled] = useState(initialTicker.enabled);
  const [tickerSpeed, setTickerSpeed] = useState(initialTicker.speedSec);
  const [tickerItems, setTickerItems] = useState<string[]>(initialTicker.items);

  const setTicker = (i: number, value: string) =>
    setTickerItems((items) => items.map((it, idx) => (idx === i ? value : it)));
  const moveTicker = (i: number, dir: -1 | 1) =>
    setTickerItems((items) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return items;
      const copy = [...items];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const setLink = (i: number, patch: Partial<Social>) =>
    setSocial((s) => s.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const move = (i: number, dir: -1 | 1) =>
    setSocial((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  async function save() {
    setSaving(true);
    try {
      await updateProfile({
        artistName, heroKicker, tagline, bio, logoUrl, avatarUrl, ogImageUrl,
        topLeft, topRight,
        ticker: {
          enabled: tickerEnabled,
          speedSec: tickerSpeed,
          items: tickerItems.map((s) => s.trim()).filter(Boolean),
        },
        socialLinks: social.filter((s) => s.label && s.url),
      });
      toast.success("Profile saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-name">Artist name</Label>
        <Input id="p-name" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-kicker">Kicker (small label above the headline)</Label>
        <Input id="p-kicker" value={heroKicker} onChange={(e) => setHeroKicker(e.target.value)} placeholder="Producer · Artist" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-tag">Tagline</Label>
        <Input id="p-tag" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Late-night beats, blown-out drums & tape hiss." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-bio">Bio</Label>
        <Textarea id="p-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <UploadField label="Logo (shown at the top)" value={logoUrl} onChange={setLogoUrl} />
      <UploadField label="Avatar (optional)" value={avatarUrl} onChange={setAvatarUrl} />
      <UploadField label="Share image / OG image (optional)" value={ogImageUrl} onChange={setOgImageUrl} />

      <div className="space-y-3 rounded-md border border-border p-4">
        <Label>Top bar</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p-tl" className="text-xs text-muted-foreground">Left</Label>
            <Input id="p-tl" value={topLeft} onChange={(e) => setTopLeft(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-tr" className="text-xs text-muted-foreground">Right</Label>
            <Input id="p-tr" value={topRight} onChange={(e) => setTopRight(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-md border border-border p-4">
        <div className="flex items-center justify-between">
          <Label>Ticker bar</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show</span>
            <Switch checked={tickerEnabled} onCheckedChange={setTickerEnabled} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="p-speed" className="text-xs text-muted-foreground">Scroll seconds</Label>
          <Input
            id="p-speed"
            type="number"
            min={5}
            max={180}
            className="w-24"
            value={tickerSpeed}
            onChange={(e) => setTickerSpeed(Number(e.target.value) || 26)}
          />
          <span className="text-xs text-muted-foreground">lower = faster</span>
        </div>
        {tickerItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col">
              <Button type="button" variant="ghost" size="icon" className="size-5" disabled={i === 0} onClick={() => moveTicker(i, -1)} aria-label="Move up">
                <ChevronUp className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-5" disabled={i === tickerItems.length - 1} onClick={() => moveTicker(i, 1)} aria-label="Move down">
                <ChevronDown className="size-4" />
              </Button>
            </div>
            <Input className="flex-1" placeholder="Phrase" value={item} onChange={(e) => setTicker(i, e.target.value)} />
            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => setTickerItems((items) => items.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => setTickerItems((items) => [...items, ""])}>
          <Plus className="mr-1 size-4" /> Add phrase
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Social links</Label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSocial((s) => [...s, { label: "", url: "", icon: "link" }])}
          >
            <Plus className="mr-1 size-4" /> Add
          </Button>
        </div>
        {social.map((link, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col">
              <Button type="button" variant="ghost" size="icon" className="size-5" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                <ChevronUp className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-5" disabled={i === social.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                <ChevronDown className="size-4" />
              </Button>
            </div>
            <Input className="w-32" placeholder="Label" value={link.label} onChange={(e) => setLink(i, { label: e.target.value })} />
            <Input className="min-w-[180px] flex-1" placeholder="https://…" value={link.url} onChange={(e) => setLink(i, { url: e.target.value })} />
            <Select value={link.icon ?? "link"} onValueChange={(v) => setLink(i, { icon: v ?? "link" })}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICONS.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => setSocial((s) => s.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
    </div>
  );
}
