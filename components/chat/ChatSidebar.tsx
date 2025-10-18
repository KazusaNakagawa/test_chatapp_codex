"use client";

import {
  Button,
  Flex,
  Heading,
  VStack,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Conversation } from "@/lib/chat/types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onStartConversation: () => void;
  onCollapseStack: () => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onStartConversation,
  onCollapseStack,
}: ChatSidebarProps) {
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      as="aside"
      direction="column"
      w={{ base: "full", lg: "72" }}
      px={{ base: 4, lg: 6 }}
      py={{ base: 4, lg: 6 }}
      gap={{ base: 4, lg: 6 }}
      borderRightWidth={{ base: 0, lg: "1px" }}
      borderBottomWidth={{ base: "1px", lg: 0 }}
      borderColor={borderColor}
      bg={sidebarBg}
    >
      <Heading size="md">Architect GPT</Heading>
      <Button
        leftIcon={
          <chakra.span role="img" aria-hidden fontSize="lg" lineHeight="1">
            ＋
          </chakra.span>
        }
        variant="outline"
        size="sm"
        onClick={() => {
          onStartConversation();
          onCollapseStack();
        }}
      >
        新しいチャット
      </Button>
      <VStack
        spacing="2"
        alignItems="stretch"
        flex="1"
        overflowY="auto"
        pr="1"
        maxH={{ base: "40vh", lg: "unset" }}
        role="list"
      >
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          return (
            <Button
              key={conversation.id}
              role="listitem"
              justifyContent="flex-start"
              variant={isActive ? "solid" : "ghost"}
              colorScheme={isActive ? "teal" : undefined}
              size="sm"
              onClick={() => {
                onSelectConversation(conversation.id);
                onCollapseStack();
              }}
            >
              {conversation.title}
            </Button>
          );
        })}
      </VStack>
    </Flex>
  );
}
