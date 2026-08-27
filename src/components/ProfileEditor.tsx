"use client";

import { useState } from "react";
import { Profile } from "@prisma/client";

interface ProfileEditorProps {
  profile: Profile;
  email: string;
}

export function ProfileEditor({ profile, email }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pincode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const response = await fetch(`/api/profile/update`, {
        method: "PATCH",
        body: formDataObj,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      setSuccessMessage("✅ Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(`❌ ${error instanceof Error ? error.message : "Error updating profile"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
    });
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="mt-6 rounded-2xl border border-gold/20 bg-paper p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-maroon/40 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-maroon hover:bg-maroon/5"
          >
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 font-body text-sm text-green-700">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 font-body text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
            Email (Cannot change)
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full rounded-lg border border-gold/30 bg-ivory px-4 py-2 font-body text-sm text-ink/50"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
              isEditing
                ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                : "border-gold/20 bg-ivory text-ink/50"
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="+91 9999999999"
            className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
              isEditing
                ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                : "border-gold/20 bg-ivory text-ink/50"
            }`}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="123 Main Street"
            className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
              isEditing
                ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                : "border-gold/20 bg-ivory text-ink/50"
            }`}
          />
        </div>

        {/* City, State, Pincode */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Mumbai"
              className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
                isEditing
                  ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                  : "border-gold/20 bg-ivory text-ink/50"
              }`}
            />
          </div>

          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Maharashtra"
              className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
                isEditing
                  ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                  : "border-gold/20 bg-ivory text-ink/50"
              }`}
            />
          </div>

          <div>
            <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="400001"
              className={`mt-1 w-full rounded-lg border px-4 py-2 font-body text-sm ${
                isEditing
                  ? "border-gold/40 bg-white text-ink focus:border-maroon focus:outline-none"
                  : "border-gold/20 bg-ivory text-ink/50"
              }`}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-lg bg-maroon px-4 py-2 font-body text-sm font-semibold uppercase tracking-wide text-white hover:bg-maroon/90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-maroon/40 px-4 py-2 font-body text-sm font-semibold uppercase tracking-wide text-maroon hover:bg-maroon/5 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
