"use client";

import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkspaces } from "@/app/_features/workspaces/api/use-get-workspaces";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/app/_features/workspaces/store/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspaceById(workspaceId);
  const { data: workspaces } = useGetWorkspaces();
  const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId);
  const [open, setOpen] = useCreateWorkspaceModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 shrink-0 animate-spin" />
          ) : (
            workspace?.name[0].toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspace?._id}`)}
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize"
            onClick={() => router.push(`/workspace/${workspace?._id}`)}
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061]  text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name[0].toUpperCase()}
            </div>
            <div className="truncate">{workspace.name} Workspace</div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer capitalize"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-xl rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          <div>Create a new workspace</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
