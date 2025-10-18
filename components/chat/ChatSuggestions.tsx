"use client";

import { Box, Button, Wrap, WrapItem, useColorModeValue } from "@chakra-ui/react";

interface ChatSuggestionsProps {
  suggestions: readonly string[];
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  const suggestionBg = useColorModeValue("white", "gray.800");

  return (
    <Box px={{ base: 4, lg: 8 }} py={{ base: 4, lg: 6 }}>
      <Wrap spacing="3">
        {suggestions.map((suggestion) => (
          <WrapItem key={suggestion}>
            <Button
              size="sm"
              variant="outline"
              bg={suggestionBg}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
}
