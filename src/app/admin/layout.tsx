import { redirect } from "next/navigation";
import { authServer } from "@/lib/auth/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await authServer.getSession();

  if (!user) {
    redirect("/auth/login");
  }

  await dbConnect();
  const dbUser = await User.findOne({ neonAuthId: user.id }).lean();

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome,</span>
            <span className="text-sm font-medium text-gray-900">
              {dbUser.name}
            </span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
