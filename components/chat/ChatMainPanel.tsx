"use client";

import { Flex, useColorModeValue } from "@chakra-ui/react";
import type { RefObject } from "react";
import type { ChatMessage } from "@/lib/chat/types";
import { ChatHeader } from "./ChatHeader";
import { ChatStackPanel } from "./ChatStackPanel";
import { ChatMessageList } from "./ChatMessageList";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatComposer } from "./ChatComposer";
import type { UseChatComposerResult } from "./hooks/useChatComposer";

interface ChatMainPanelProps {
  isStackOpen: boolean;
  onToggleStack: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  hydrated: boolean;
  suggestions: readonly string[];
  endRef: RefObject<HTMLDivElement>;
  composer: UseChatComposerResult;
}

export function ChatMainPanel({
  isStackOpen,
  onToggleStack,
  messages,
  isTyping,
  hydrated,
  suggestions,
  endRef,
  composer,
}: ChatMainPanelProps) {
  const mainBodyBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex flex="1" direction="column" w="full" bg={mainBodyBg}>
      <ChatHeader isStackOpen={isStackOpen} onToggleStack={onToggleStack} />

      <ChatStackPanel isOpen={isStackOpen} />

      <ChatMessageList
        messages={messages}
        isTyping={isTyping}
        hydrated={hydrated}
        endRef={endRef}
      />

      <ChatSuggestions suggestions={suggestions} onSelect={composer.onSuggestion} />

      <ChatComposer
        value={composer.value}
        onChange={composer.onChange}
        onSubmit={composer.onSubmit}
        onKeyDown={composer.onKeyDown}
        textareaRef={composer.textareaRef}
      />
    </Flex>
  );
}
