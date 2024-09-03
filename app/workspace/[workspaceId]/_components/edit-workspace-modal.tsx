import { useUpdateWorkspace } from "@/app/_features/workspaces/api/use-update-workspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Doc, Id } from "@/convex/_generated/dataModel";
import React, { useState } from "react";
import { toast } from "sonner";

interface EditWorkspaceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspace: Doc<"workspaces">;
}

export default function EditWorkspaceModal({
  open,
  setOpen,
  workspace,
}: EditWorkspaceModalProps) {
  const [name, setName] = useState(workspace.name);
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useUpdateWorkspace();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await mutate(
        { name, workspaceId: workspace._id },
        {
          onSuccess(data) {
            handleClose();
            toast.success("Workspace updated");
          },
          onError() {
            console.log("error");
            toast.error("Failed to update workspace");
          },
          onSettled() {},
        }
      );
    } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <Input
            disabled={isPending}
            required
            placeholder="Workspace name"
            autoFocus
            minLength={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-x-2 justify-end">
            <DialogClose asChild>
              <Button disabled={isPending} variant={"outline"} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
