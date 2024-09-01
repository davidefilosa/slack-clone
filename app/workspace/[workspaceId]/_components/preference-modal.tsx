"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePreferenceModal } from "@/app/_features/workspaces/store/use-preference-modal";
import { Trash } from "lucide-react";
import { useUpdateWorkspace } from "@/app/_features/workspaces/api/use-update-workspace";
import { useDeleteWorkspace } from "@/app/_features/workspaces/api/use-delete-workspace";
import EditWorkspaceModal from "./edit-workspace-modal";
import { Doc } from "@/convex/_generated/dataModel";
import { CancelWorkspaceDialog } from "./cancel-workspace-dialog";

interface PreferenceModalProps {
  workspace: Doc<"workspaces">;
}

export const PreferenceModal = ({ workspace }: PreferenceModalProps) => {
  const [open, setOpen] = usePreferenceModal();
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  return (
    <>
      <EditWorkspaceModal
        open={editOpen}
        setOpen={setEditOpen}
        workspace={workspace}
      />
      <CancelWorkspaceDialog
        open={cancelOpen}
        setOpen={setCancelOpen}
        workspaceId={workspace._id}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{workspace.name}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Workspace name</p>
                <p
                  className="text-sm text-[#1264A3] hover:underline font-semibold"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </p>
              </div>
              <p className="text-sm">{workspace.name}</p>
            </div>
            <button
              disabled={false}
              onClick={() => {
                setCancelOpen(true);
              }}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semiboldd">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
