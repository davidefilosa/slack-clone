"use client";

import { useGetIndividualChannel } from "@/app/_features/channels/api/use-get-individual-channel";
import { useChannelId } from "@/hooks/use-channelId";
import { Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./_components/channel-header";
import { ChatInput } from "./_components/chat-input";
import { useGetMessages } from "@/app/_features/messages/api/use-get-messages";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });
  console.log(results);
  const { data: channel, isLoading } = useGetIndividualChannel(channelId);

  if (isLoading)
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="animate-spin size-4 text-muted-foreground" />
      </div>
    );

  if (!channel)
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader name={channel.name} />
      <div className="flex-1">{JSON.stringify(results)}</div>
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
