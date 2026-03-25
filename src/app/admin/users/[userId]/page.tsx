import Link from "next/link";
import { notFound } from "next/navigation";
import { authServer } from "@/lib/auth/server";
import { getAdminUser } from "@/lib/admin-data";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import UserRoleSelect from "@/components/admin/UserRoleSelect";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const user = await getAdminUser(userId);

  if (!user) {
    notFound();
  }

  const session = await authServer.getSession();
  const authUser = session?.data?.user;

  const currentAdminResult = authUser
    ? await db
        .select()
        .from(users)
        .where(eq(users.neonAuthId, authUser.id))
        .limit(1)
    : [];

  const currentAdmin = currentAdminResult[0];
  const isSelf = currentAdmin?.id === user._id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Users
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            User Information
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{user.email}</dd>
            </div>
            {user.phone && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-gray-900">{user.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Current Role
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Change Role
            </h2>
            <UserRoleSelect
              userId={user._id}
              currentRole={user.role}
              isSelf={isSelf}
            />
          </div>

          {user.shippingAddress && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
              <div className="text-sm text-gray-600">
                <p>{user.shippingAddress.street}</p>
                <p>
                  {user.shippingAddress.city}, {user.shippingAddress.state}{" "}
                  {user.shippingAddress.postalCode}
                </p>
                <p>{user.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
