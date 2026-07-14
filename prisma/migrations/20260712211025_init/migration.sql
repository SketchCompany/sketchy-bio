-- CreateEnum
CREATE TYPE "TileType" AS ENUM ('LINK', 'TEXT', 'HEADER', 'IMAGE', 'VIDEO', 'SPOTIFY', 'APPLE_MUSIC', 'SOUNDCLOUD', 'YOUTUBE', 'EMBED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "artistName" TEXT NOT NULL DEFAULT 'Sketchy',
    "bio" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT,
    "logoUrl" TEXT,
    "backgroundStyle" TEXT NOT NULL DEFAULT 'black',
    "theme" JSONB NOT NULL DEFAULT '{}',
    "socialLinks" JSONB NOT NULL DEFAULT '[]',
    "ogImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BentoGridItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "type" "TileType" NOT NULL DEFAULT 'LINK',
    "url" TEXT,
    "content" TEXT,
    "mediaUrl" TEXT,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "w" INTEGER NOT NULL DEFAULT 1,
    "h" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BentoGridItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "BentoGridItem_isActive_order_idx" ON "BentoGridItem"("isActive", "order");
