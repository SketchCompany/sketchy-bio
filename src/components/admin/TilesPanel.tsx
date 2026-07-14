"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";
import type { BentoGridItem } from "@prisma/client";
import { Pencil, Trash2, Eye, EyeOff, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TileDialog } from "./TileDialog";
import { deleteTile, toggleTile, saveLayout } from "@/lib/actions";

const Grid = WidthProvider(Responsive);

export function TilesPanel({ tiles }: { tiles: BentoGridItem[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BentoGridItem | null>(null);
  const [pending, setPending] = useState<Layout[] | null>(null);
  const [savingLayout, setSavingLayout] = useState(false);

  const layout: Layout[] = useMemo(
    () => tiles.map((t) => ({ i: t.id, x: t.x, y: t.y, w: t.w, h: t.h, maxW: 4, maxH: 3, minW: 1, minH: 1 })),
    [tiles],
  );
  // Stable identity so RGL doesn't re-init on every render.
  const layouts = useMemo(
    () => ({ lg: layout, md: layout, sm: layout, xs: layout }),
    [layout],
  );

  const refresh = () => router.refresh();

  async function onDelete(t: BentoGridItem) {
    if (!confirm(`Delete "${t.title || t.type}"? This cannot be undone.`)) return;
    try {
      await deleteTile(t.id);
      toast.success("Tile deleted");
      refresh();
    } catch {
      toast.error("Delete failed");
    }
  }

  async function onToggle(t: BentoGridItem) {
    try {
      await toggleTile(t.id, !t.isActive);
      refresh();
    } catch {
      toast.error("Could not update visibility");
    }
  }

  async function persistLayout() {
    if (!pending) return;
    setSavingLayout(true);
    try {
      await saveLayout(pending.map((l) => ({ id: l.i, x: l.x, y: l.y, w: l.w, h: l.h })));
      toast.success("Layout saved");
      setPending(null);
      refresh();
    } catch {
      toast.error("Could not save layout");
    } finally {
      setSavingLayout(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Tiles &amp; layout</h2>
          <p className="text-sm text-muted-foreground">
            Drag to move, pull the corner to resize, then save the layout.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={!pending || savingLayout} onClick={persistLayout}>
            <Save className="mr-1.5 size-4" />
            {savingLayout ? "Saving…" : "Save layout"}
          </Button>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-1.5 size-4" /> Add tile
          </Button>
        </div>
      </div>

      {tiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No tiles yet. Click “Add tile” to create your first one.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card/40 p-2">
          <Grid
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1024, md: 768, sm: 480, xs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 1 }}
            rowHeight={116}
            margin={[14, 14]}
            draggableCancel=".no-drag"
            // Keep tiles exactly where they are placed: no auto-compaction, no
            // reshuffle on re-render. Mark dirty only on real drag/resize.
            compactType={null}
            preventCollision
            onDragStop={(l) => setPending(l)}
            onResizeStop={(l) => setPending(l)}
            isBounded
          >
            {tiles.map((t) => (
              <div key={t.id} className="group relative overflow-hidden rounded-md border border-border bg-card">
                <div className="flex h-full flex-col justify-between p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {t.type.replace("_", " ")}
                    </span>
                    <div className="no-drag flex gap-0.5 opacity-70 transition group-hover:opacity-100">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => onToggle(t)} title={t.isActive ? "Hide" : "Show"}>
                        {t.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => { setEditing(t); setDialogOpen(true); }} title="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7 text-destructive" onClick={() => onDelete(t)} title="Delete">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="truncate text-sm font-medium">{t.title || <span className="text-muted-foreground">Untitled</span>}</p>
                    {t.url && <p className="truncate text-xs text-muted-foreground">{t.url}</p>}
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-wide">
                      <span className="text-muted-foreground">{t.clickCount} click{t.clickCount === 1 ? "" : "s"}</span>
                      {!t.isActive && <span className="text-amber-500">Hidden</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </div>
      )}

      <TileDialog open={dialogOpen} onOpenChange={setDialogOpen} tile={editing} onSaved={refresh} />
    </div>
  );
}
