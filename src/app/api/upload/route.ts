import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";
const MAX_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || "25");

const IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const PASSTHROUGH = new Set([
  "image/gif", // keep animation
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File exceeds ${MAX_MB} MB` }, { status: 413 });
  }
  if (!IMAGE.has(file.type) && !PASSTHROUGH.has(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
  }

  // Absolute UPLOAD_DIR (production, served by Nginx) or relative to the app (dev).
  const dir = path.isAbsolute(UPLOAD_DIR) ? UPLOAD_DIR : path.join(process.cwd(), UPLOAD_DIR);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());

  let filename: string;
  if (IMAGE.has(file.type)) {
    // Re-encode static images to webp, capped at 1600px.
    filename = `${randomUUID()}.webp`;
    const out = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await writeFile(path.join(dir, filename), out);
  } else {
    const ext = file.type === "video/quicktime" ? "mov" : file.type.split("/")[1];
    filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, filename), buffer);
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
