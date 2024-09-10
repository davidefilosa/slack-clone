"use client";

import { useCreateOrGetConversation } from "@/app/_features/conversation/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-memberId";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect } from "react";
import { Conversation } from "./_components/conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const { data, mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({ workspaceId, memberId });
  }, [workspaceId, memberId, mutate]);

  if (isPending)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (!data)
    return (
      <div className="w-full h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-5  text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );

  return <Conversation data={data} />;
};

export default MemberIdPage;
