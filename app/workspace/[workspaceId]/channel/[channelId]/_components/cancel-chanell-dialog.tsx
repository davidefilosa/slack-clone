import { useDeleteChannel } from "@/app/_features/channels/api/use-delete-channel";
import { useDeleteWorkspace } from "@/app/_features/workspaces/api/use-delete-workspace";
import { usePreferenceModal } from "@/app/_features/workspaces/store/use-preference-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CancelChannelDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  channelId: Id<"channels">;
}

export const CancelChannelDialog = ({
  open,
  setOpen,
  channelId,
}: CancelChannelDialogProps) => {
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useDeleteChannel();

  const handleSubmit = async () => {
    try {
      const data = await mutate(
        { channelId },
        {
          onSuccess(data) {
            handleClose();
            toast.success("Chanel cancelled");
            router.replace("/");
          },
          onError() {
            console.log("error");
            toast.error("Failed to cancel channel");
          },
          onSettled() {},
        }
      );
    } catch (error) {}
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            channel and remove all the messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={() => handleSubmit()}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
