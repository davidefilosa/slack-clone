"use client";

import { CreateWorkspaceModal } from "@/app/_features/workspaces/components/create-workspace-modal";
import { PreferenceModal } from "@/app/workspace/[workspaceId]/_components/preference-modal";
import { useEffect, useState } from "react";

export const ModalsProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
