import Link from "next/link";
import { getAdminUsers } from "@/lib/admin-data";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    role?: string;
    q?: string;
  }>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const { users, pagination } = await getAdminUsers({
    page,
    role: params.role,
    q: params.q,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <form className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              name="q"
              placeholder="Search by name or email..."
              defaultValue={params.q}
              className="input-field w-64"
            />
            <select
              name="role"
              defaultValue={params.role || ""}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Filter
            </button>
          </form>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(user._id)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              basePath="/admin/users"
            />
          </div>
        )}
      </div>
    </div>
  );
}
