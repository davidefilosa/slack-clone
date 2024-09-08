import { useDeleteMessage } from "@/app/_features/messages/api/use-delete-message";
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

interface CancelMessageDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  messageId: Id<"messages">;
  setIsRemoving: (state: boolean) => void;
}

export const CancelMessageDialog = ({
  open,
  setOpen,
  messageId,
  setIsRemoving,
}: CancelMessageDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useDeleteMessage();

  const handleSubmit = async () => {
    try {
      setIsRemoving(true);
      const data = await mutate(
        { id: messageId },
        {
          onSuccess(data) {
            handleClose();
            toast.success("Messsage cancelled");
            setIsRemoving(false);
          },

          onError() {
            console.log("error");
            toast.error("Failed to cancel message");
          },
          onSettled() {
            setIsRemoving(false);
          },
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
            message.
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
