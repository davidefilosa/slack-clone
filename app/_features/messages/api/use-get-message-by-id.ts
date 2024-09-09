import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetMessageById = (messageId: Id<"messages">) => {
  const data = useQuery(api.messages.getMessageById, { messageId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
