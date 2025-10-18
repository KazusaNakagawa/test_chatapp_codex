"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  chakra,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { STACK_ROWS, SUGGESTIONS } from "@/lib/chat/constants";
import { useChat } from "@/lib/chat/useChat";

const autoResize = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = "auto";
  const maxHeight = 220;
  const nextHeight = Math.min(element.scrollHeight, maxHeight);
  element.style.height = `${nextHeight}px`;
};

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

const TypingIndicator = () => {
  const bounce = keyframes`
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-2px); }
  `;

  return (
    <HStack spacing={1}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          w="2"
          h="2"
          borderRadius="full"
          bg="teal.400"
          animation={`${bounce} 1.2s ease-in-out ${index * 0.2}s infinite`}
        />
      ))}
    </HStack>
  );
};

const Form = chakra("form");

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
  const { colorMode, toggleColorMode } = useColorMode();
  const stackDisclosure = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [inputValue]);

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
    setTimeout(() => autoResize(textareaRef.current), 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (inputValue.trim().length > 0) {
        sendMessage(inputValue);
        setInputValue("");
        setTimeout(() => autoResize(textareaRef.current), 0);
      }
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    textareaRef.current?.focus();
  };

  const messageList = useMemo(() => activeConversation?.messages ?? [], [activeConversation]);

  const layoutBg = useColorModeValue("gray.100", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const mainHeaderBg = useColorModeValue("white", "gray.800");
  const mainBodyBg = useColorModeValue("gray.50", "gray.900");
  const panelBg = useColorModeValue("white", "gray.800");
  const surfaceBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const suggestionBg = useColorModeValue("white", "gray.800");
  const textareaBg = useColorModeValue("white", "gray.800");

  return (
    <Flex h="100%" minH="100vh" bg={layoutBg}>
      <Flex
        as="aside"
        direction="column"
        w="72"
        px="6"
        py="6"
        gap="6"
        borderRightWidth="1px"
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
            startNewChat();
            stackDisclosure.onClose();
          }}
        >
          新しいチャット
        </Button>
        <VStack
          spacing="2"
          align="stretch"
          flex="1"
          overflowY="auto"
          pr="1"
          role="list"
        >
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeId;
            return (
              <Button
                key={conversation.id}
                role="listitem"
                justifyContent="flex-start"
                variant={isActive ? "solid" : "ghost"}
                colorScheme={isActive ? "teal" : undefined}
                size="sm"
                onClick={() => {
                  selectConversation(conversation.id);
                  stackDisclosure.onClose();
                }}
              >
                {conversation.title}
              </Button>
            );
          })}
        </VStack>
      </Flex>

      <Flex flex="1" direction="column" bg={mainBodyBg}>
        <Flex
          as="header"
          px="8"
          py="6"
          align="center"
          justify="space-between"
          borderBottomWidth="1px"
          borderColor={borderColor}
          bg={mainHeaderBg}
        >
          <Box>
            <Heading size="lg">ChatGPT風 UI</Heading>
            <Text fontSize="sm" color={secondaryText}>
              TypeScript + React + Next.js アーキテクト構成
            </Text>
          </Box>
          <HStack spacing="3">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={
                <chakra.span role="img" aria-hidden fontSize="lg" lineHeight="1">
                  🧱
                </chakra.span>
              }
              onClick={stackDisclosure.onToggle}
              aria-expanded={stackDisclosure.isOpen}
            >
              スタック情報
            </Button>
            <IconButton
              aria-label="テーマを切り替える"
              icon={
                <chakra.span role="img" aria-hidden fontSize="lg" lineHeight="1">
                  {colorMode === "dark" ? "☀️" : "🌙"}
                </chakra.span>
              }
              onClick={toggleColorMode}
              variant="ghost"
            />
          </HStack>
        </Flex>

        <Collapse in={stackDisclosure.isOpen} animateOpacity>
          <Box px="8" py="6" borderBottomWidth="1px" borderColor={borderColor} bg={panelBg}>
            <Heading size="md" mb="2">
              アーキテクトレイヤー
            </Heading>
            <Text fontSize="sm" color={secondaryText} mb="6">
              docs/readme.md に記載された構成案を元にスタック情報を整理しています。
            </Text>
            <Flex
              direction="column"
              gap="4"
              maxH={{ base: "60vh", lg: "50vh" }}
              overflowY="auto"
              pr="2"
            >
              {STACK_ROWS.map((row) => (
                <Box
                  key={row.layer}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  p="4"
                  bg={surfaceBg}
                >
                  <Flex justify="space-between" align="center" mb="2" gap="4">
                    <Box>
                      <Text fontWeight="semibold">{row.layer}</Text>
                      <Text fontSize="sm" color={secondaryText}>
                        {row.technologies}
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize="sm" mb="2">
                    {row.benefit}
                  </Text>
                  <Text fontSize="sm" color={secondaryText}>
                    {row.note}
                    {row.source ? (
                      <>
                        {" "}
                        <Button
                          as="a"
                          href={row.source.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          variant="link"
                          colorScheme="teal"
                          size="sm"
                        >
                          {row.source.label}
                        </Button>
                      </>
                    ) : null}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Collapse>

        <Box
          flex="1"
          overflowY="auto"
          px="8"
          py="6"
          display="flex"
          flexDirection="column"
          gap="4"
          aria-live="polite"
        >
          {hydrated ? (
            <>
              {messageList.map((message) => {
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
          <Box ref={endOfMessagesRef} />
        </Box>

        <Box px="8" py="4">
          <Wrap spacing="3">
            {SUGGESTIONS.map((suggestion) => (
              <WrapItem key={suggestion}>
                <Button
                  size="sm"
                  variant="outline"
                  bg={suggestionBg}
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        <Form
          display="flex"
          gap="4"
          px="8"
          py="6"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          <Textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            resize="none"
            placeholder="メッセージを入力して Enter で送信（Shift + Enter で改行）"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onInput={(event) => autoResize(event.currentTarget)}
            required
            bg={textareaBg}
          />
          <Button type="submit" isDisabled={!inputValue.trim()}>
            送信
          </Button>
        </Form>
      </Flex>
    </Flex>
  );
}
