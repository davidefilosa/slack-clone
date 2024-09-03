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

interface CancelWorkspaceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspaceId: Id<"workspaces">;
}

export const CancelWorkspaceDialog = ({
  open,
  setOpen,
  workspaceId,
}: CancelWorkspaceDialogProps) => {
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };
  const [preferenceOpen, setpreferenceOpen] = usePreferenceModal();

  const { mutate, data, isError, isSettled, isSuccess, isPending, error } =
    useDeleteWorkspace();

  const handleSubmit = async () => {
    try {
      const data = await mutate(
        { workspaceId },
        {
          onSuccess(data) {
            handleClose();
            toast.success("Workspace cancelled");
            setpreferenceOpen(false);
            router.replace("/");
          },
          onError() {
            console.log("error");
            toast.error("Failed to cancel workspace");
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
            This action cannot be undone. This will permanently delete your
            accountthe workspace and remove all the members.
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
