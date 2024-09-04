"use client";

import { useResetCode } from "@/app/_features/workspaces/api/use-reset-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { ResetCodeDialog } from "./reset-code-dialog";
import { useState } from "react";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: Doc<"workspaces">;
}

export const InviteModal = ({ open, setOpen, workspace }: InviteModalProps) => {
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspace._id}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Link copied to clipboad!"));
  };

  const { mutate, isPending } = useResetCode();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    mutate(
      { workspaceId: workspace._id },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },

        onError: () => {
          toast.error("Failed to regenerate new code");
        },
      }
    );
  };

  return (
    <>
      <ResetCodeDialog
        handleReset={handleReset}
        open={confirmOpen}
        setOpen={setConfirmOpen}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>Invite people to {workspace.name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-3xl font-bold tracking-tighter uppercase">
              {workspace.joinCode}
            </p>
            <Button variant={"ghost"} size={"sm"} onClick={() => handleCopy()}>
              Copy Link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full p-4">
            <Button
              onClick={() => setConfirmOpen(true)}
              variant={"outline"}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
