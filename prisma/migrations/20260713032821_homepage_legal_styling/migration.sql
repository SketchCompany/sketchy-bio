-- AlterTable
ALTER TABLE "BentoGridItem" ADD COLUMN     "style" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "ticker" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "topLeft" TEXT NOT NULL DEFAULT 'Self-hosted',
ADD COLUMN     "topRight" TEXT NOT NULL DEFAULT 'Transmission 001';

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_slug_key" ON "LegalPage"("slug");
