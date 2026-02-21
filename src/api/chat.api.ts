// src/api/chat.api.ts

import { http } from "./http";

export interface ChatMessagePayload {
  role: "user" | "assistant";
  content: string;
  mode: string;
  attachments?: string[];
}

export const chatApi = {
  createMessage: async (payload: ChatMessagePayload) => {
    const { data } = await http.post("/chat/messages", payload);
    return data;
  },

  invokeLLM: async (payload: {
    prompt: string;
    file_urls?: string[];
  }) => {
    const { data } = await http.post("/llm/invoke", payload);
    return data?.response || data;
  },
};