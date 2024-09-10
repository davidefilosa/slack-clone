"use client";

import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const useMemberId = () => {
  const params = useParams<{ memberId: Id<"members"> }>();

  return params.memberId;
};
