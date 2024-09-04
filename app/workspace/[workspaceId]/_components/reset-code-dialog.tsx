import { useDeleteWorkspace } from "@/app/_features/workspaces/api/use-delete-workspace";
import { useResetCode } from "@/app/_features/workspaces/api/use-reset-code";
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

interface ResetCodeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleReset: () => void;
}

export const ResetCodeDialog = ({
  open,
  setOpen,
  handleReset,
}: ResetCodeDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the old
            code and people can not longer join your workspace with it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={() => {
              handleReset();
              handleClose();
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
