"use client";

import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { STACK_ROWS } from "@/lib/chat/constants";

interface ChatStackPanelProps {
  isOpen: boolean;
}

export function ChatStackPanel({ isOpen }: ChatStackPanelProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const panelBg = useColorModeValue("white", "gray.800");
  const surfaceBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.500", "gray.400");

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box
        px={{ base: 4, lg: 8 }}
        py={{ base: 4, lg: 6 }}
        borderBottomWidth="1px"
        borderColor={borderColor}
        bg={panelBg}
      >
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
  );
}
