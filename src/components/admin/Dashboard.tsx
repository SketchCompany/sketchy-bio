"use client";

import type { BentoGridItem, LegalPage, Profile } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TilesPanel } from "./TilesPanel";
import { ProfileForm } from "./ProfileForm";
import { ThemeEditor } from "./ThemeEditor";
import { LegalEditor } from "./LegalEditor";

export function Dashboard({
  profile,
  tiles,
  legalPages,
}: {
  profile: Profile | null;
  tiles: BentoGridItem[];
  legalPages: LegalPage[];
}) {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="legal">Legal</TabsTrigger>
      </TabsList>
      <TabsContent value="content" className="mt-6">
        <TilesPanel tiles={tiles} />
      </TabsContent>
      <TabsContent value="profile" className="mt-6">
        <ProfileForm profile={profile} />
      </TabsContent>
      <TabsContent value="appearance" className="mt-6">
        <ThemeEditor profile={profile} />
      </TabsContent>
      <TabsContent value="legal" className="mt-6">
        <LegalEditor pages={legalPages} />
      </TabsContent>
    </Tabs>
  );
}
