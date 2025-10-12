export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface StackRow {
  layer: string;
  technologies: string;
  benefit: string;
  note: string;
  source?: {
    label: string;
    url: string;
  };
}
