"use client";

import { useCurrentMember } from "@/app/_features/members/api/use-current-member";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspaceId";
import { cn } from "@/lib/utils";

interface ReactionProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);
  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="flex items-cente gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <button
          key={reaction._id}
          onClick={() => onChange(reaction.value)}
          className={cn(
            "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center",
            reaction.memberIds.includes(currentMemberId) &&
              "bg-blue-100/70 border-blue-500 text-white"
          )}
        >
          {reaction.value}
          <span
            className={cn(
              "text-sm font-xs text-muted-foreground",
              reaction.memberIds.includes(currentMemberId) && "text-blue-500"
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
};
