import { UseProfileMemberId } from "@/app/_features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/app/_features/messages/api/store/use-parent-message-id";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = UseProfileMemberId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };
  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
    profileMemberId,
    onOpenProfile,
  };
};
