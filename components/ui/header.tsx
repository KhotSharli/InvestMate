import { HeaderLogo } from "@/components/ui/header-logo";
import { Navigation } from "@/components/ui/navigation";
import { WelcomeMsg } from "@/components/ui/welcome-msg";

import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const Header = () => {
  return (
    <header
      style={{ backgroundColor: "#17CF97" }}
      className="px-4 py-8 lg:px-14 pb-36"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton afterSwitchSessionUrl="/" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};