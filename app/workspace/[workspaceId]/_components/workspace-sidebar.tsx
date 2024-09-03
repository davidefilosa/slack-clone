"use client";

import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/app/_features/channels/api/use-get-channels";
import { ChannelSection } from "./channel-sections";
import { useGetMembers } from "@/app/_features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/app/_features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } =
    useCurrentMember(workspaceId);

  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspaceById(workspaceId);

  const { data: channels, isLoading: isLoadingChannels } =
    useGetChannels(workspaceId);

  const { data: members, isLoading: isLoadingMembers } =
    useGetMembers(workspaceId);

  const [open, setOpen] = useCreateChannelModal();

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
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Draft & Sent" icon={SendHorizonal} id="draft" />
      </div>
      <ChannelSection
        label="Channels"
        hint="New channel"
        onNew={() => setOpen(true)}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item.name}
          />
        ))}
      </ChannelSection>
      <ChannelSection
        label="Direct messages"
        hint="Open a direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item.user._id}
            image={item.user.image}
            label={item.user.name}
          />
        ))}
      </ChannelSection>
    </div>
  );
};
