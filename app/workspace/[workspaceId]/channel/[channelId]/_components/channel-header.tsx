"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import EditChannelModal from "./edit-channel-modal";
import { useChannelId } from "@/hooks/use-channelId";
import { CancelChannelDialog } from "./cancel-chanell-dialog";

interface ChannelHeaderProps {
  name: string;
}

export const ChannelHeader = ({ name }: ChannelHeaderProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const channelId = useChannelId();
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <EditChannelModal
        open={editOpen}
        setOpen={setEditOpen}
        initialName={name}
      />
      <CancelChannelDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        channelId={channelId}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate"># {name}</span>
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {name}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div
              className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              onClick={() => setEditOpen(true)}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Channel name</p>
                <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                  Edit
                </p>
              </div>
              <p className="text-sm"># {name}</p>
            </div>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
