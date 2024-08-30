"use client";

import { UserButton } from "@/app/_features/auth/components/user-button";
import React from "react";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="w-[70px] h-dull bg-[#481349] flex flex-col gap-y-4  items-center pt-4">
      <WorkspaceSwitcher />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
