"use client";

import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } =
    useCurrentMember(workspaceId);

  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspaceById(workspaceId);

  if (isLoadingMember || isLoadingWorkspace)
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#5E2C5F]">
        <Loader className="animate-spin text-white size-5" />;
      </div>
    );

  if (!workspace || !member)
    return (
      <div className="flex flex-col h-full items-center justify-center bg-[#5E2C5F] gap-y-2">
        <AlertTriangle className=" text-white size-5" />;
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  return (
    <div className="flex flex-col h-full bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};
