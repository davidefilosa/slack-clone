"use client";

import { GetMessagesReturnType } from "@/app/_features/messages/api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { isContext } from "vm";

const TIME_THERESHOLD = 5;

interface MessagesListProps {
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  memberName?: string;
  memberImage?: string;
}

export const MessagesList = ({
  channelName,
  channelCreationTime,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
  memberImage,
  memberName,
  variant = "channel",
}: MessagesListProps) => {
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message!._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE,MMMM d");
  };

  return (
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
                isEditing={false}
                setEditingId={() => {}}
                isCompact={isCompact}
                hideThreadButton={false}
                isAuthor={false}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
