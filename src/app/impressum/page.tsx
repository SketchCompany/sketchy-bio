import { LegalPageRoute, legalMetadata } from "@/components/public/LegalPageRoute";

export const revalidate = 3600;
export const generateMetadata = () => legalMetadata("impressum");

export default function Page() {
  return <LegalPageRoute slug="impressum" />;
}
