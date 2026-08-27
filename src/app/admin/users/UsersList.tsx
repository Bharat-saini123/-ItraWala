"use client";

import { useState } from "react";
import { prisma } from "@/lib/prisma";
import type { Profile } from "@prisma/client";

type UserWithOrders = Profile & {
  orders: { id: string }[];
};

export default function UsersList({ initialUsers }: { initialUsers: UserWithOrders[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);

  const handleEdit = (user: Profile) => {
    setEditingId(user.id);
    setEditData(user);
  };

  const handleSave = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
        setEditingId(null);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="rounded-lg border border-gold/20 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/20 bg-paper">
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Email
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Name
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Phone
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Role
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Orders
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Joined
              </th>
              <th className="px-6 py-4 text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gold/10 hover:bg-paper/50">
                {editingId === user.id ? (
                  <>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.email}</td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editData.fullName || ""}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        className="rounded border border-gold/30 px-2 py-1 font-body text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="rounded border border-gold/30 px-2 py-1 font-body text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editData.role || "CUSTOMER"}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value as any })}
                        className="rounded border border-gold/30 px-2 py-1 font-body text-sm"
                      >
                        <option>CUSTOMER</option>
                        <option>ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.orders.length}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSave(user.id)}
                        disabled={loading}
                        className="mr-2 rounded bg-green-600 px-3 py-1 font-body text-xs text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="rounded bg-gray-400 px-3 py-1 font-body text-xs text-white hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.email}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.fullName || "—"}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-maroon/10 text-maroon"
                            : "bg-gold/10 text-gold-dark"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-ink">{user.orders.length}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded bg-maroon px-3 py-1 font-body text-xs text-white hover:bg-maroon-dark"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="font-body text-sm text-ink/60">No users found</p>
        </div>
      )}
    </div>
  );
}
