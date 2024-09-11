"use client";

import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import { useDeleteMember } from "@/app/_features/members/api/use-delete-member";
import { useGetMemberById } from "@/app/_features/members/api/use-get-member-by-id";
import { useUpdateRole } from "@/app/_features/members/api/use-update-role";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { AlertTriangle, ChevronDown, Loader, Mail, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}
export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember(workspaceId);
  const { data: member, isLoading: isLoadingMember } =
    useGetMemberById(memberId);
  const { mutate: updateRole, isPending: isPendingRole } = useUpdateRole();
  const { mutate: deleteMember, isPending: IsPendingDelete } =
    useDeleteMember();

  const handleCancel = async () => {
    try {
      const data = await deleteMember(
        { memberId },
        {
          onSuccess(data) {
            setOpen(false);
            toast.success("Member removed");
          },
          onError() {
            console.log("error");
            toast.error("Failed to remove member");
          },
          onSettled() {},
        }
      );
    } catch (error) {}
  };

  const handleRoleChange = async () => {
    try {
      const data = await updateRole(
        { memberId, role: member?.role === "admin" ? "member" : "admin" },
        {
          onSuccess(data) {
            setOpen(false);
            toast.success("Role changed");
          },
          onError() {
            console.log("error");
            toast.error("Failed to change role");
          },
          onSettled() {},
        }
      );
    } catch (error) {}
  };

  if (isLoadingMember || isLoadingCurrentMember)
    return (
      <div className="full-h flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!member)
    return (
      <div className="full-h flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-xl font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <X className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="w-full h-full flex flex-col gap-y-2 items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  return (
    <div className="full-h flex flex-col">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              member from the workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={"destructive"} onClick={() => handleCancel()}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-xl font-bold">Profile</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <X className="size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full rounded-md">
          <AvatarImage src={member.user.image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {member.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
        {currentMember?.role === "admin" && currentMember._id !== memberId ? (
          <div className="flex items-center gap-2 mt-4">
            <Popover>
              <PopoverTrigger className="w-full">
                <Button variant={"outline"} className="w-full capitalize">
                  {member.role} <ChevronDown className="size-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  variant={"outline"}
                  className="w-full capitalize"
                  onClick={() => handleRoleChange()}
                >
                  {member.role == "admin" ? "member" : "admin"}
                </Button>
              </PopoverContent>
            </Popover>
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => setOpen(true)}
            >
              Remove
            </Button>
          </div>
        ) : currentMember?._id === memberId &&
          currentMember?.role !== "admin" ? (
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => setOpen(true)}
          >
            Leave
          </Button>
        ) : null}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information:</p>
        <div className="flex item-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <Mail className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
