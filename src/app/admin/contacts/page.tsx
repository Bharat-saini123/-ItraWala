import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContactsList from "./ContactsList";

export const metadata = { title: "Contact Messages — Admin" };

export default async function ContactsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile || profile.role !== "ADMIN") {
    redirect("/");
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-maroon">Contact Messages</h1>
        <p className="mt-2 text-sm text-ink/60">View all contact form submissions</p>
      </div>

      <ContactsList initialMessages={messages} />
    </div>
  );
}
