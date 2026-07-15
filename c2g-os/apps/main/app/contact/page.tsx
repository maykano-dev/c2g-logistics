import { getCachedSettings } from "@/utils/cache";
import { ContactClient } from "./contact-client";

export const metadata = {
  title: "Contact Us | C2G Logistics",
  description: "Get in touch with the C2G Logistics team.",
};

export default async function ContactPage() {
  const settings = await getCachedSettings();
  const supportNumber = settings?.support_number || "+233 20 914 0388";

  return <ContactClient supportNumber={supportNumber} />;
}
