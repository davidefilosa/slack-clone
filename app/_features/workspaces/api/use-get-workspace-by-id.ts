import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetWorkspaceById = (workspaceId: Id<"workspaces">) => {
  const data = useQuery(api.workspaces.getById, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
