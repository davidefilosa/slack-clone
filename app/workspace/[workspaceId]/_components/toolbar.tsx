"use client";

import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { Info, Search } from "lucide-react";
import React from "react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspaceById(workspaceId);
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent/50 w-full justify-start h-7 px-2"
        >
          <Search className="size-4 mr-2 text-white" />
          <span className="text-white text-xs">Search in {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
