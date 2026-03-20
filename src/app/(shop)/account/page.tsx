"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        setUser(data.user);
        setProfileForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
        });
        if (data.user.shippingAddress) {
          setAddressForm({
            street: data.user.shippingAddress.street || "",
            city: data.user.shippingAddress.city || "",
            state: data.user.shippingAddress.state || "",
            postalCode: data.user.shippingAddress.postalCode || "",
            country: data.user.shippingAddress.country || "",
          });
        }
      } catch (err) {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.push("/auth/sign-in");
          return;
        }
        const errorMessage = err instanceof Error ? err.message : "Failed to load profile";
        // Don't show error for empty/invalid responses
        if (errorMessage !== "Invalid response format") {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone || undefined,
      });
      setUser(data.user);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await updateProfile({ shippingAddress: addressForm });
      setUser(data.user);
      setSuccess("Shipping address updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update address"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 space-y-6">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Account</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Profile Information */}
      <form
        onSubmit={handleSaveProfile}
        className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              className="input-field mt-1"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              className="input-field mt-1"
              placeholder="(555) 123-4567"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Shipping Address */}
      <form
        onSubmit={handleSaveAddress}
        className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Shipping Address
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Required for checkout
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              className="input-field mt-1"
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="input-field mt-1"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="input-field mt-1"
                placeholder="NY"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, postalCode: e.target.value })
                }
                className="input-field mt-1"
                placeholder="10001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                className="input-field mt-1"
                placeholder="US"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}
