import ConversationItem from "./conversation-item";
import { useChatStore } from "@/store/useChatStore";

const MessagesSidebar = () => {
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation
  );

  const conversationUsers = users;
  const conversationConversations = conversations;

  //   const conversations = [];

  return (
    <div
      className="relative w-[30rem] border-r border-[#e9e9e9e9] 
    dark:border-[#80808026]
    pt-6 md:h-[calc(100dvh-200px)] pr-4"
    >
      {conversationConversations.length === 0 ? (
        <>
          {conversationConversations.length === 0 && (
            <div
              className={`w-full flex items-start justify-between gap-3 rounded-[0.9375rem] p-4 text-left transition-all bg-lavender dark:bg-[#80808026] `}
            >
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 min-h-10 min-w-10 rounded-full bg-white dark:bg-[#808080]"></div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col  gap-2 mt-3 ">
                    <div className="w-[7.125rem] bg-white h-[0.875rem] dark:bg-[#808080]"></div>
                    <div className="w-[7.125rem] bg-white h-[0.875rem] dark:bg-[#808080]"></div>
                  </div>
                </div>
              </div>

              <div className="w-[3.25rem] bg-white h-[0.875rem] mt-2 dark:bg-[#808080]"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col gap-2 pr-4">
          {conversationConversations.map((conversation) => {
            const participantId = conversation.participants.find(
              (id) => id !== "current_user"
            );
            const participant = participantId
              ? users[participantId]
              : undefined;
            return (
              <ConversationItem
                key={conversation.id}
                name={
                  participant
                    ? `${participant.first_name} ${participant.last_name}`.trim()
                    : "Unknown user"
                }
                avatar={participant?.profile_photo}
                status={participant?.status}
                lastMessage={conversation.lastMessage}
                lastMessageAt={conversation.lastMessageAt}
                unreadCount={conversation.unreadCount}
                isActive={currentConversationId === conversation.id}
                isMessageRequest={conversation.isMessageRequest}
                onClick={() => setCurrentConversation(conversation.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesSidebar;
