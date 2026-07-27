import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Segurança em profundidade: o middleware já cobre isso, mas revalidamos aqui.
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-black">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header session={session} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
