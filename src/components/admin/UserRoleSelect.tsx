"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRoleSelectProps {
  userId: string;
  currentRole: "customer" | "admin";
  isSelf: boolean;
}

export default function UserRoleSelect({
  userId,
  currentRole,
  isSelf,
}: UserRoleSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (newRole: "customer" | "admin") => {
    if (newRole === currentRole) return;

    const action = newRole === "admin" ? "promote to admin" : "demote to customer";
    if (!confirm(`Are you sure you want to ${action}?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isSelf) {
    return (
      <p className="text-sm text-gray-500">
        You cannot change your own role
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <select
        value={currentRole}
        onChange={(e) => handleRoleChange(e.target.value as "customer" | "admin")}
        disabled={loading}
        className="input-field"
      >
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
