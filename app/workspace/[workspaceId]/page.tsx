"use client";

import { useGetWorkspaceById } from "@/app/_features/workspaces/api/use-get-workspace-by-id";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { Loader } from "lucide-react";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceById(workspaceId);

  if (isLoading)
    return <Loader className="animate-spin size-4 text-muted-foreground" />;

  return <div>{data?.name}</div>;
};

export default WorkspaceIdPage;
