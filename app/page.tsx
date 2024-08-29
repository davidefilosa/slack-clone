"use client";

import { useEffect, useMemo } from "react";
import { UserButton } from "./_features/auth/components/user-button";
import { useGetWorkspaces } from "./_features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "./_features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
