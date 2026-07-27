import { MobileSidebar } from "./mobile-sidebar";
import { GlobalSearch } from "./global-search";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";
import { Separator } from "@/components/ui/separator";
import { getHeaderNotifications } from "@/lib/data/notifications";
import type { SessionPayload } from "@/lib/auth";

export async function Header({ session }: { session: SessionPayload }) {
  const notifications = await getHeaderNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-brand-black/80 px-4 backdrop-blur-md lg:px-6">
      <MobileSidebar />
      <div className="flex flex-1">
        <GlobalSearch />
      </div>

      <Separator orientation="vertical" className="hidden h-8 sm:block" />

      <Notifications items={notifications} />

      <Separator orientation="vertical" className="hidden h-8 sm:block" />

      <UserMenu nome={session.nome} email={session.email} papel={session.papel} />
    </header>
  );
}
