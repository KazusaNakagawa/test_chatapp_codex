"use client";

import {
  Avatar,
  Badge,
  Box,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { ChatMessage } from "@/lib/chat/types";
import { useMemo } from "react";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  hydrated: boolean;
  endRef: React.RefObject<HTMLDivElement>;
}

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

const typingAnimation = keyframes`
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
`;

function TypingIndicator() {
  return (
    <HStack spacing={1}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          w="2"
          h="2"
          borderRadius="full"
          bg="teal.400"
          animation={`${typingAnimation} 1.2s ease-in-out ${index * 0.2}s infinite`}
        />
      ))}
    </HStack>
  );
}

export function ChatMessageList({
  messages,
  isTyping,
  hydrated,
  endRef,
}: ChatMessageListProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const surfaceBg = useColorModeValue("white", "gray.800");
  const mainBodyBg = useColorModeValue("gray.50", "gray.900");

  const renderedMessages = useMemo(() => messages, [messages]);

  return (
    <Box
      flex="1"
      overflowY="auto"
      px={{ base: 4, lg: 8 }}
      py={{ base: 4, lg: 6 }}
      display="flex"
      flexDirection="column"
      gap="4"
      aria-live="polite"
      bg={mainBodyBg}
    >
      {hydrated ? (
        <>
          {renderedMessages.map((message) => {
            const isAssistant = message.role === "assistant";
            return (
              <Box
                key={message.id}
                alignSelf={isAssistant ? "flex-start" : "flex-end"}
                maxW="3xl"
                w="full"
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                bg={isAssistant ? surfaceBg : "teal.500"}
                color={isAssistant ? undefined : "white"}
                p="4"
                shadow="sm"
              >
                <HStack spacing="3" mb="2">
                  <Avatar
                    size="sm"
                    name={isAssistant ? "Architect GPT" : "You"}
                    bg={isAssistant ? "teal.500" : "gray.500"}
                    color="white"
                  />
                  <Text fontWeight="semibold">
                    {isAssistant ? "Architect GPT" : "あなた"}
                  </Text>
                  <Badge variant={isAssistant ? "subtle" : "solid"} ml="auto">
                    {formatTime(message.createdAt)}
                  </Badge>
                </HStack>
                <Text whiteSpace="pre-wrap">{message.content}</Text>
              </Box>
            );
          })}
          {isTyping ? (
            <Box
              alignSelf="flex-start"
              maxW="xs"
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              bg={surfaceBg}
              p="4"
            >
              <HStack spacing="3">
                <Avatar size="sm" name="Architect GPT" bg="teal.500" color="white" />
                <Text fontWeight="semibold">Architect GPT</Text>
                <Badge variant="subtle" colorScheme="gray">
                  入力中…
                </Badge>
              </HStack>
              <Box mt="3" aria-label="AIが入力中">
                <TypingIndicator />
              </Box>
            </Box>
          ) : null}
        </>
      ) : (
        <Box
          alignSelf="flex-start"
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          bg={surfaceBg}
          p="4"
        >
          <HStack spacing="3" mb="2">
            <Avatar size="sm" name="Architect GPT" bg="teal.500" color="white" />
            <Text fontWeight="semibold">Architect GPT</Text>
          </HStack>
          <Text>チャット履歴を読み込み中です…</Text>
        </Box>
      )}
      <Box ref={endRef} />
    </Box>
  );
}
