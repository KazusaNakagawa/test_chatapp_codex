"use client";

import { useEffect } from "react";
import {
  Button,
  Textarea,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";

const Form = chakra("form");

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLFormElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const autoResize = (element: HTMLTextAreaElement | null) => {
  if (!element) {
    return;
  }
  element.style.height = "auto";
  const maxHeight = 220;
  const nextHeight = Math.min(element.scrollHeight, maxHeight);
  element.style.height = `${nextHeight}px`;
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  textareaRef,
}: ChatComposerProps) {
  const textareaBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [value, textareaRef]);

  return (
    <Form
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="stretch"
      gap={{ base: 3, md: 4 }}
      px={{ base: 4, lg: 8 }}
      py={{ base: 4, lg: 6 }}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
    >
      <Textarea
        id="chat-input"
        ref={textareaRef}
        rows={1}
        resize="none"
        placeholder="メッセージを入力して Enter で送信（Shift + Enter で改行）"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => autoResize(event.currentTarget)}
        required
        bg={textareaBg}
        minH="52px"
      />
      <Button
        type="submit"
        isDisabled={!value.trim()}
        alignSelf={{ base: "stretch", md: "flex-end" }}
      >
        送信
      </Button>
    </Form>
  );
}
