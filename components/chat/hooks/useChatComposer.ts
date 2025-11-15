"use client";

import { useCallback, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, RefObject } from "react";

interface UseChatComposerOptions {
  onSend: (message: string) => void;
}

export interface UseChatComposerResult {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLFormElement>) => void;
  onSuggestion: (suggestion: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export const useChatComposer = ({ onSend }: UseChatComposerOptions): UseChatComposerResult => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendCurrentMessage = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setValue("");
  }, [onSend, value]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendCurrentMessage();
    },
    [sendCurrentMessage]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendCurrentMessage();
      }
    },
    [sendCurrentMessage]
  );

  const handleSuggestion = useCallback((suggestion: string) => {
    setValue(suggestion);
    textareaRef.current?.focus();
  }, []);

  return {
    value,
    onChange: setValue,
    onSubmit: handleSubmit,
    onKeyDown: handleKeyDown,
    onSuggestion: handleSuggestion,
    textareaRef,
  };
};
