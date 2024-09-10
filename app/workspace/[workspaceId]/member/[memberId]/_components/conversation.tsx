"use client";

import { useGetMemberById } from "@/app/_features/members/api/use-get-member-by-id";
import { useGetMessages } from "@/app/_features/messages/api/use-get-messages";
import { Doc } from "@/convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-memberId";
import { AlertTriangle, Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessagesList } from "../../../channel/[channelId]/_components/messages-list";

interface ConversationProps {
  data: Doc<"conversations">;
}
export const Conversation = ({ data }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: otherMember, isLoading } = useGetMemberById(memberId);
  const { results, status, loadMore } = useGetMessages({
    conversationId: data._id,
  });

  if (isLoading || status === "LoadingFirstPage")
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (!otherMember)
    return (
      <div className="w-full h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertTriangle className="size-5  text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Member not found</p>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header
        name={otherMember.user.name}
        image={otherMember.user.image}
        onClick={() => {}}
      />
      <MessagesList
        data={results}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
        variant="conversation"
        memberImage={otherMember.user.image}
        memberName={otherMember.user.name}
      />
      <ChatInput
        placeholder={`Message ${otherMember.user.name}`}
        conversationId={data._id}
      />
    </div>
  );
};
