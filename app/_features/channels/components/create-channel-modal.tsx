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
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspaceId";

export const CreateChannelModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const workspaceId = useWorkspaceId();

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useCreateChannel();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await mutate(
        { name, workspaceId },
        {
          onSuccess(data) {
            handleClose();
            router.push(`/workspace/${workspaceId}/channel/${data}`);
            toast.success("Channel created");
          },
          onError() {
            console.log("error");
            toast.error("Failed to create channel");
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
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <Input
            disabled={false}
            required
            placeholder="Channel name"
            autoFocus
            minLength={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
