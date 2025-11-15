"use client";

import { useMemo } from "react";
import { Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { SUGGESTIONS } from "@/lib/chat/constants";
import { useChat } from "@/lib/chat/useChat";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMainPanel } from "./ChatMainPanel";
import { useChatComposer } from "./hooks/useChatComposer";
import { useAutoScrollToLatest } from "./hooks/useAutoScrollToLatest";

export default function ChatApp() {
  const {
    conversations,
    activeConversation,
    activeId,
    selectConversation,
    startNewChat,
    sendMessage,
    isTyping,
    hydrated,
  } = useChat();

  const stackDisclosure = useDisclosure();
  const composer = useChatComposer({ onSend: sendMessage });
  const messageList = useMemo(() => activeConversation?.messages ?? [], [activeConversation]);
  const endOfMessagesRef = useAutoScrollToLatest(messageList.length, isTyping);
  const layoutBg = useColorModeValue("gray.100", "gray.900");

  return (
    <Flex
      h="100%"
      minH="100vh"
      bg={layoutBg}
      direction={{ base: "column", lg: "row" }}
    >
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={selectConversation}
        onStartConversation={startNewChat}
        onCollapseStack={stackDisclosure.onClose}
      />

      <ChatMainPanel
        isStackOpen={stackDisclosure.isOpen}
        onToggleStack={stackDisclosure.onToggle}
        messages={messageList}
        isTyping={isTyping}
        hydrated={hydrated}
        suggestions={SUGGESTIONS}
        endRef={endOfMessagesRef}
        composer={composer}
      />
    </Flex>
  );
}
