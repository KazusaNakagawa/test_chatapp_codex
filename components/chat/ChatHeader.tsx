"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  chakra,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

interface ChatHeaderProps {
  isStackOpen: boolean;
  onToggleStack: () => void;
}

export function ChatHeader({ isStackOpen, onToggleStack }: ChatHeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const background = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      as="header"
      px={{ base: 4, lg: 8 }}
      py={{ base: 4, lg: 6 }}
      align="center"
      justify="space-between"
      borderBottomWidth="1px"
      borderColor={borderColor}
      bg={background}
    >
      <Box>
        <Heading size="lg">ChatGPT風 UI</Heading>
        <Text fontSize="sm" color={secondaryText}>
          TypeScript + React + Next.js アーキテクト構成
        </Text>
      </Box>
      <HStack spacing={{ base: 2, lg: 3 }}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={
            <chakra.span role="img" aria-hidden fontSize="lg" lineHeight="1">
              🧱
            </chakra.span>
          }
          onClick={onToggleStack}
          aria-expanded={isStackOpen}
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
  );
}
