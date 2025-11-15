"use client";

import { useEffect, useRef } from "react";

export const useAutoScrollToLatest = (
  messageCount: number,
  isTyping: boolean
) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, isTyping]);

  return endRef;
};
