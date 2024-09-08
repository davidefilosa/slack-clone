"use client";

import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/app/_features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CancelMessageDialog } from "./cancel-message-dialog";
import { useState } from "react";
import { useDeleteMessage } from "@/app/_features/messages/api/use-delete-message";
import { useCreateReaction } from "@/app/_features/reactions/api/use-create-reaction";
import { Reactions } from "./reactions";
const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  isAuthor: boolean;
}
export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  threadCount,
  threadImage,
  threadTimestamp,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
  };
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { mutate: updateMessage, isPending: isUpdetingMessage } =
    useUpdateMessage();

  const { mutate: createReaction, isPending: isPendingReaction } =
    useCreateReaction();

  const isPending = isUpdetingMessage || isPendingReaction;

  const handleReaction = (value: string) => {
    createReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to set reaction");
        },
      }
    );
  };

  const handleUpdateMessage = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Updated");
          setEditingId(null);
        },

        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  if (isCompact)
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemoving &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <CancelMessageDialog
          messageId={id}
          open={cancelOpen}
          setOpen={setCancelOpen}
          setIsRemoving={setIsRemoving}
        />
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdateMessage}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            <div className="flex flex-col w-full">
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
            </div>
          </div>
        )}
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => {
              setEditingId(id);
            }}
            handleThread={() => {}}
            handleDelete={() => {
              setCancelOpen(true);
            }}
            hideThreadButton={hideThreadButton}
            handleReaction={handleReaction}
          />
        )}
      </div>
    );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        isRemoving &&
          "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
      )}
    >
      <CancelMessageDialog
        messageId={id}
        open={cancelOpen}
        setOpen={setCancelOpen}
        setIsRemoving={setIsRemoving}
      />
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-md">
            <AvatarImage src={authorImage} className="rounded-md" />
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdateMessage}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button className="font-bold text-primary hover:underline">
                {authorName}
              </button>
              <span>
                &nbsp;&nbsp;
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </span>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
            <Reactions data={reactions} onChange={handleReaction} />
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => {
            setEditingId(id);
          }}
          handleThread={() => {}}
          handleDelete={() => {
            setCancelOpen(true);
          }}
          hideThreadButton={hideThreadButton}
          handleReaction={handleReaction}
        />
      )}
    </div>
  );
};
