"use client";

import { UserButton } from "@/app/_features/auth/components/user-button";
import React from "react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { BellIcon, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-dull bg-[#481349] flex flex-col gap-y-4  items-center pt-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquare} label="DMs" />
      <SidebarButton icon={BellIcon} label="activity" />
      <SidebarButton icon={MoreHorizontal} label="more" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
