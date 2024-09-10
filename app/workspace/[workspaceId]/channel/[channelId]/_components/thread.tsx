"use client";

import { useGetMessageById } from "@/app/_features/messages/api/use-get-message-by-id";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { AlertTriangle, Loader, X } from "lucide-react";
import { Message } from "./message";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import Quill from "quill";
import { useCreateMessage } from "@/app/_features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/app/_features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import { useChannelId } from "@/hooks/use-channelId";
import { useGetMessages } from "@/app/_features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const TIME_THERESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
  parentMessageId: Id<"messages">;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const { data: message, isLoading } = useGetMessageById(messageId);
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);
  const isAuthor = message?.memberId === currentMember?._id;
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE,MMMM d");
  };

  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message!._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
        parentMessageId: messageId,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image!.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }
      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Faild to send the message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  if (isLoading || status === "LoadingFirstPage")
    return (
      <div className="full-h flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-xl font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!message)
    return (
      <div className="full-h flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-xl font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="w-full h-full flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-xl font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <X className="size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index, array) => {
              const isCompact =
                array[index].user?._id === array[index - 1]?.user._id &&
                differenceInMinutes(
                  new Date(array[index]._creationTime),
                  new Date(array[index - 1]?._creationTime)
                ) < TIME_THERESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={true}
                  isAuthor={message.memberId === currentMember?._id}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          id={message._id}
          memberId={message.memberId}
          reactions={message.reactions}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={isAuthor}
        />
      </div>
      <div className="px-4">
        <Editor
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder="Replay..."
          key={editorKey}
          innerRef={editorRef}
          variant="create"
        />
      </div>
    </div>
  );
};
