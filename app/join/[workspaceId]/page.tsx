"use client";

import { useGetInfoById } from "@/app/_features/workspaces/api/use-get-info-by-id";
import { useJoin } from "@/app/_features/workspaces/api/use-join";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoin();
  const { data: workspace, isLoading } = useGetInfoById(workspaceId);
  const router = useRouter();

  useEffect(() => {
    if (workspace?.isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [workspace, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: () => {
          toast.success("Workspace joined");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center p-8 rounded-lg shadow-md">
      <Image src={"/logo.png"} width={60} height={60} alt="logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y- items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspace?.name}</h1>
          <p className="text-md text-medium">Enter workspace code to join</p>
        </div>
        <VerificationInput
          autoFocus
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          onComplete={(e) => handleComplete(e)}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
