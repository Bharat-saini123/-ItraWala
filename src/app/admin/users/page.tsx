import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersList from "./UsersList";

export const metadata = { title: "Users — Admin" };

export default async function UsersPage() {
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

  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        select: { id: true },
      },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-maroon">Users Management</h1>
        <p className="mt-2 text-sm text-ink/60">Manage all registered users</p>
      </div>

      <UsersList initialUsers={users} />
    </div>
  );
}
