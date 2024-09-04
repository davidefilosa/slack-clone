"use client";

import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const useChannelId = () => {
  const params = useParams<{ channelId: Id<"channels"> }>();

  return params.channelId;
};
