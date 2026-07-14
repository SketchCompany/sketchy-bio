"use client";

import { useEffect, useState } from "react";
import type { BentoGridItem } from "@prisma/client";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UploadField } from "./UploadField";
import { detectType, extractIframeSrc } from "@/lib/embeds";
import { createTile, updateTile } from "@/lib/actions";
import { resolveTileStyle, SIZE_LABELS, type TileStyle } from "@/lib/tile-style";

const TYPES = [
  "LINK", "TEXT", "HEADER", "IMAGE", "VIDEO",
  "SPOTIFY", "APPLE_MUSIC", "SOUNDCLOUD", "YOUTUBE", "EMBED",
] as const;

type Draft = {
  title: string;
  type: (typeof TYPES)[number];
  url: string;
  content: string;
  mediaUrl: string | null;
  tag: string;
  style: TileStyle;
  w: number;
  h: number;
  isActive: boolean;
};

const empty: Draft = {
  title: "", type: "LINK", url: "", content: "", mediaUrl: null, tag: "", style: {}, w: 1, h: 1, isActive: true,
};

function fromTile(t: BentoGridItem): Draft {
  return {
    title: t.title, type: t.type, url: t.url ?? "", content: t.content ?? "",
    mediaUrl: t.mediaUrl, tag: t.tag ?? "", style: resolveTileStyle(t.style),
    w: t.w, h: t.h, isActive: t.isActive,
  };
}

const NEEDS_URL = new Set(["LINK", "SPOTIFY", "APPLE_MUSIC", "SOUNDCLOUD", "YOUTUBE", "EMBED", "VIDEO"]);
const NEEDS_MEDIA = new Set(["IMAGE", "VIDEO"]);
const NEEDS_TEXT = new Set(["TEXT", "HEADER"]);

export function TileDialog({
  open, onOpenChange, tile, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tile?: BentoGridItem | null;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(tile ? fromTile(tile) : empty);
  }, [open, tile]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const payload = {
        title: draft.title,
        type: draft.type,
        // Store a clean src even if the user pasted a full <iframe> snippet.
        url: draft.url ? extractIframeSrc(draft.url) : null,
        content: draft.content || null,
        mediaUrl: draft.mediaUrl,
        tag: draft.tag.trim() || null,
        style: draft.style,
        w: draft.w,
        h: draft.h,
        isActive: draft.isActive,
      };
      if (tile) await updateTile(tile.id, payload);
      else await createTile(payload);
      toast.success(tile ? "Tile updated" : "Tile created");
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tile ? "Edit tile" : "New tile"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={draft.type} onValueChange={(v) => set("type", v as Draft["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="t-title">Title</Label>
            <Input id="t-title" value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="t-tag">Tag / label (optional)</Label>
            <Input
              id="t-tag"
              value={draft.tag}
              placeholder="e.g. Latest drop"
              onChange={(e) => set("tag", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The small uppercase label on the tile. Empty uses the automatic one.
            </p>
          </div>

          {NEEDS_URL.has(draft.type) && (
            <div className="space-y-2">
              <Label htmlFor="t-url">{draft.type === "EMBED" ? "Embed code or URL" : "URL"}</Label>
              {draft.type === "EMBED" ? (
                <Textarea
                  id="t-url"
                  rows={4}
                  className="max-h-40 resize-none overflow-y-auto font-mono text-xs"
                  value={draft.url}
                  placeholder='Paste an <iframe …></iframe> snippet or a URL'
                  onChange={(e) => set("url", e.target.value)}
                />
              ) : (
                <Input
                  id="t-url"
                  value={draft.url}
                  placeholder="https://…"
                  onChange={(e) => {
                    const url = e.target.value;
                    set("url", url);
                    // auto-detect the type from a freshly pasted link or iframe
                    if (url && (draft.type === "LINK" || !draft.url)) {
                      const guess = detectType(url);
                      if (guess !== "LINK") set("type", guess);
                    }
                  }}
                />
              )}
              {draft.type === "EMBED" && (
                <p className="text-xs text-muted-foreground">
                  The embed is scaled to fill the tile. Set its width/height with the size options below.
                </p>
              )}
            </div>
          )}

          {NEEDS_MEDIA.has(draft.type) && (
            <UploadField
              label={draft.type === "VIDEO" ? "Video / GIF file" : "Image file"}
              value={draft.mediaUrl}
              onChange={(v) => set("mediaUrl", v)}
              accept={draft.type === "VIDEO" ? "video/*,image/gif" : "image/*"}
            />
          )}

          {NEEDS_TEXT.has(draft.type) && (
            <div className="space-y-2">
              <Label htmlFor="t-content">{draft.type === "HEADER" ? "Subtitle (optional)" : "Text"}</Label>
              <Textarea
                id="t-content"
                rows={3}
                className="max-h-40 overflow-y-auto"
                value={draft.content}
                onChange={(e) => set("content", e.target.value)}
              />
            </div>
          )}

          {NEEDS_TEXT.has(draft.type) && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <p className="text-sm font-medium">Text styling</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={draft.style.size ?? "default"}
                    onValueChange={(v) =>
                      set("style", { ...draft.style, size: v && v !== "default" ? (v as TileStyle["size"]) : undefined })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      {(["sm", "md", "lg", "xl"] as const).map((s) => (
                        <SelectItem key={s} value={s}>{SIZE_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <Select
                    value={draft.style.align ?? "default"}
                    onValueChange={(v) =>
                      set("style", { ...draft.style, align: v && v !== "default" ? (v as TileStyle["align"]) : undefined })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-20">Colour</Label>
                <input
                  type="color"
                  aria-label="Text colour"
                  value={draft.style.color ?? "#f4eef9"}
                  onChange={(e) => set("style", { ...draft.style, color: e.target.value })}
                  className="size-9 cursor-pointer rounded border border-border bg-transparent"
                />
                {draft.style.color && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => set("style", { ...draft.style, color: undefined })}>
                    Reset colour
                  </Button>
                )}
              </div>
            </div>
          )}

          {!NEEDS_TEXT.has(draft.type) && (
            <div className="space-y-2">
              <Label htmlFor="t-sub">Subtitle (optional)</Label>
              <Input id="t-sub" value={draft.content} onChange={(e) => set("content", e.target.value)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Width</Label>
              <Select value={String(draft.w)} onValueChange={(v) => set("w", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n} col</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Select value={String(draft.h)} onValueChange={(v) => set("h", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((n) => <SelectItem key={n} value={String(n)}>{n} row</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <Label htmlFor="t-active">Visible on page</Label>
              <p className="text-xs text-muted-foreground">Hidden tiles stay saved but don&apos;t show.</p>
            </div>
            <Switch id="t-active" checked={draft.isActive} onCheckedChange={(v) => set("isActive", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save tile"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
