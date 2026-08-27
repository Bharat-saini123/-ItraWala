import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await prisma.profile.findUnique({ where: { id: user.id } })
    : null;

  return <CheckoutForm profile={profile} email={user?.email ?? ""} />;
}
