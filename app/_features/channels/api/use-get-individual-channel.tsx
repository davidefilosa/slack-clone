import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetIndividualChannel = (channelId: Id<"channels">) => {
  const data = useQuery(api.channels.getById, { channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
