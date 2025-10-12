'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { STACK_ROWS, SUGGESTIONS, THEME_KEY } from "@/lib/chat/constants";
import { useChat } from "@/lib/chat/useChat";

type Theme = "light" | "dark";

const autoResize = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = "auto";
  const maxHeight = 220;
  const nextHeight = Math.min(element.scrollHeight, maxHeight);
  element.style.height = `${nextHeight}px`;
};

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

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
  const [theme, setTheme] = useState<Theme>("light");
  const [showStack, setShowStack] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark") {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [inputValue]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length, isTyping]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

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

  return (
    <div className="chat-shell">
      <aside className="sidebar">
        <header className="sidebar__header">
          <h1>Architect GPT</h1>
        </header>
        <section className="sidebar__content">
          <button className="new-chat-button" type="button" onClick={startNewChat}>
            ＋ 新しいチャット
          </button>
          <div className="recent-chats" role="list">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                role="listitem"
                className={`recent-chat-item${
                  conversation.id === activeId ? " is-active" : ""
                }`}
                onClick={() => {
                  selectConversation(conversation.id);
                  setShowStack(false);
                }}
              >
                {conversation.title}
              </button>
            ))}
          </div>
        </section>
      </aside>
      <main className="main-area">
        <header className="main-area__header">
          <div>
            <h2>ChatGPT風 UI</h2>
            <p className="subtitle">TypeScript + React + Next.js アーキテクト構成</p>
          </div>
          <div className="header-actions">
            <button
              className="stack-toggle"
              type="button"
              aria-expanded={showStack}
              onClick={() => setShowStack((value) => !value)}
            >
              🧱 スタック情報
            </button>
            <button
              className="theme-toggle"
              type="button"
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>
        <section className="stack-panel" hidden={!showStack} aria-hidden={!showStack}>
          <header className="stack-panel__header">
            <h3>アーキテクトレイヤー</h3>
            <p>docs/readme.md に記載された構成案を元にスタック情報を整理しています。</p>
          </header>
          <div className="stack-panel__list">
            {STACK_ROWS.map((row) => (
              <article key={row.layer} className="stack-card">
                <div className="stack-card__layer">
                  <strong>{row.layer}</strong>
                  <span>{row.technologies}</span>
                </div>
                <p className="stack-card__detail">{row.benefit}</p>
                <p className="stack-card__note">
                  {row.note}
                  {row.source ? (
                    <>
                      {" "}
                      <a href={row.source.url} target="_blank" rel="noreferrer noopener">
                        {row.source.label}
                      </a>
                    </>
                  ) : null}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="message-list" aria-live="polite">
          {hydrated ? (
            <>
              {messageList.map((message) => (
                <article key={message.id} className={`message message--${message.role}`}>
                  <div className="message__meta">
                    <span className={`avatar avatar--${message.role}`}>
                      {message.role === "assistant" ? "AI" : "You"}
                    </span>
                    <span>{message.role === "assistant" ? "Architect GPT" : "あなた"}</span>
                    <span className="badge">{formatTime(message.createdAt)}</span>
                  </div>
                  <p className="message__content">{message.content}</p>
                </article>
              ))}
              {isTyping ? (
                <article className="message message--assistant">
                  <div className="message__meta">
                    <span className="avatar avatar--assistant">AI</span>
                    <span>Architect GPT</span>
                    <span className="badge">入力中…</span>
                  </div>
                  <div className="message__content typing" aria-label="AIが入力中">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              ) : null}
            </>
          ) : (
            <article className="message message--assistant">
              <div className="message__meta">
                <span className="avatar avatar--assistant">AI</span>
                <span>Architect GPT</span>
              </div>
              <p className="message__content">チャット履歴を読み込み中です…</p>
            </article>
          )}
          <div ref={endOfMessagesRef} />
        </section>
        <section className="suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </section>
        <form className="composer" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <label className="composer__input" htmlFor="chat-input">
            <textarea
              id="chat-input"
              ref={textareaRef}
              rows={1}
              placeholder="メッセージを入力して Enter で送信（Shift + Enter で改行）"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onInput={(event) => autoResize(event.currentTarget)}
              required
            />
          </label>
          <button className="composer__submit" type="submit" disabled={!inputValue.trim()}>
            送信
          </button>
        </form>
      </main>
    </div>
  );
}
