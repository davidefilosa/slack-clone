import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetMemberById = (memberId: Id<"members">) => {
  const data = useQuery(api.members.getById, { memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
