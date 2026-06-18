"use client";

import { useState } from "react";

type ProfileData = {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  dateOfBirth?: string | null;
  occupation?: string | null;
  nationality?: string | null;
};

type ProfileFormProps = {
  initialProfile: ProfileData;
};

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileData>({
    address: initialProfile.address ?? "",
    city: initialProfile.city ?? "",
    country: initialProfile.country ?? "",
    postalCode: initialProfile.postalCode ?? "",
    dateOfBirth: initialProfile.dateOfBirth ? initialProfile.dateOfBirth.toString().slice(0, 10) : "",
    occupation: initialProfile.occupation ?? "",
    nationality: initialProfile.nationality ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const payload = {
      address: profile.address?.trim() || undefined,
      city: profile.city?.trim() || undefined,
      country: profile.country?.trim() || undefined,
      postalCode: profile.postalCode?.trim() || undefined,
      dateOfBirth: profile.dateOfBirth?.trim() || undefined,
      occupation: profile.occupation?.trim() || undefined,
      nationality: profile.nationality?.trim() || undefined,
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to save profile. Please try again.");
        return;
      }

      setSuccess("Profile saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Edit profile</h2>
        <p className="mt-2 text-sm text-gray-500">Keep your financial profile up to date so we can personalize your experience.</p>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Address</span>
          <input
            value={profile.address ?? ""}
            onChange={(e) => handleChange("address", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="123 Main Street"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">City</span>
          <input
            value={profile.city ?? ""}
            onChange={(e) => handleChange("city", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="Austin"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Country</span>
          <input
            value={profile.country ?? ""}
            onChange={(e) => handleChange("country", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="United States"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Postal code</span>
          <input
            value={profile.postalCode ?? ""}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="78701"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Date of birth</span>
          <input
            type="date"
            value={profile.dateOfBirth ?? ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Occupation</span>
          <input
            value={profile.occupation ?? ""}
            onChange={(e) => handleChange("occupation", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="Product manager"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-gray-700">Nationality</span>
          <input
            value={profile.nationality ?? ""}
            onChange={(e) => handleChange("nationality", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            placeholder="American"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving profile..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}
