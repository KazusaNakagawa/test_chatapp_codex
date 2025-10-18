"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { SUGGESTIONS } from "@/lib/chat/constants";
import { useChat } from "@/lib/chat/useChat";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatStackPanel } from "./ChatStackPanel";
import { ChatMessageList } from "./ChatMessageList";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatComposer } from "./ChatComposer";

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

  const [inputValue, setInputValue] = useState("");
  const stackDisclosure = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isTyping]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!inputValue.trim()) {
        return;
      }
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const messageList = useMemo(() => activeConversation?.messages ?? [], [activeConversation]);
  const layoutBg = useColorModeValue("gray.100", "gray.900");
  const mainBodyBg = useColorModeValue("gray.50", "gray.900");

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

      <Flex flex="1" direction="column" w="full" bg={mainBodyBg}>
        <ChatHeader
          isStackOpen={stackDisclosure.isOpen}
          onToggleStack={stackDisclosure.onToggle}
        />

        <ChatStackPanel isOpen={stackDisclosure.isOpen} />

        <ChatMessageList
          messages={messageList}
          isTyping={isTyping}
          hydrated={hydrated}
          endRef={endOfMessagesRef}
        />

        <ChatSuggestions suggestions={SUGGESTIONS} onSelect={handleSuggestion} />

        <ChatComposer
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
        />
      </Flex>
    </Flex>
  );
}
