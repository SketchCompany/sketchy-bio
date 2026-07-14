import { LegalPageRoute, legalMetadata } from "@/components/public/LegalPageRoute";

export const revalidate = 3600;
export const generateMetadata = () => legalMetadata("agb");

export default function Page() {
  return <LegalPageRoute slug="agb" />;
}
