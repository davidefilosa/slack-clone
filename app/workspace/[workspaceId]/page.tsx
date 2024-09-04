"use client";

import { useGetChannels } from "@/app/_features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/app/_features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceIsLoading } =
    useGetWorkspaceById(workspaceId);
  const { data: channels, isLoading: channelsIsLoadin } =
    useGetChannels(workspaceId);
  const { data: member, isLoading: isLoadingMember } =
    useCurrentMember(workspaceId);
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceIsLoading ||
      channelsIsLoadin ||
      isLoadingMember ||
      !member ||
      !workspace
    )
      return;
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspace,
    workspaceIsLoading,
    channelsIsLoadin,
    open,
    setOpen,
    router,
    isLoadingMember,
    member,
  ]);

  if (workspaceIsLoading || channelsIsLoadin || isLoadingMember)
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="animate-spin size-4 text-muted-foreground" />
      </div>
    );

  if (!workspace || !member)
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
