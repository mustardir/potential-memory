import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import ProfileForm from "./ProfileForm";

const SESSION_COOKIE = "session_token";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const user = await getUserFromToken(token);
  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  const initialProfile = profile
    ? {
        address: profile.address,
        city: profile.city,
        country: profile.country,
        postalCode: profile.postalCode,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().slice(0, 10) : undefined,
        occupation: profile.occupation,
        nationality: profile.nationality,
      }
    : {};

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="mt-2 text-gray-600">Update your contact and personal details.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Address</p>
              <p className="mt-2 text-gray-900">{profile?.address ?? "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">City</p>
              <p className="mt-2 text-gray-900">{profile?.city ?? "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Country</p>
              <p className="mt-2 text-gray-900">{profile?.country ?? "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Postal Code</p>
              <p className="mt-2 text-gray-900">{profile?.postalCode ?? "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Date of Birth</p>
              <p className="mt-2 text-gray-900">{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Occupation</p>
              <p className="mt-2 text-gray-900">{profile?.occupation ?? "Not set"}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-700">Nationality</p>
              <p className="mt-2 text-gray-900">{profile?.nationality ?? "Not set"}</p>
            </div>
          </div>
        </div>

        <ProfileForm initialProfile={initialProfile} />
      </div>
    </main>
  );
}
