import { useUpdateChannel } from "@/app/_features/channels/api/use-update-channel";
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
import { useChannelId } from "@/hooks/use-channelId";
import React, { useState } from "react";
import { toast } from "sonner";

interface EditWorkspaceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialName: string;
}

export default function EditChannelModal({
  open,
  setOpen,
  initialName,
}: EditWorkspaceModalProps) {
  const [name, setName] = useState(initialName);
  const channelId = useChannelId();
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useUpdateChannel();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await mutate(
        { name, channelId },
        {
          onSuccess(data) {
            handleClose();
            toast.success("Channel updated");
          },
          onError() {
            console.log("error");
            toast.error("Failed to update channel");
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
          <DialogTitle>Edit channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <Input
            disabled={isPending}
            required
            placeholder="Workspace name"
            autoFocus
            minLength={3}
            value={name}
            onChange={(e) => handleChange(e)}
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
