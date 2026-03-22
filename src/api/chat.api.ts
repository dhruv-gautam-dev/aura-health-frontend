// src/api/chat.api.ts

import { toast } from "sonner";
import { http } from "./http";
import axios from 'axios';
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const BASE_URL = '/api/v1/chat';

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

/**
 * Sends a message to the Aura Health AI Assistant and retrieves the response.
 * @param {string} message - The user's message.
 * @param {string | null} sessionId - The current session ID, or null for a new session.
 * @param {string} token - The Firebase ID Token for authentication.
 * @returns {Promise<{ reply: string; session_id: string }>} - The AI's reply and the session ID.
 */
export async function sendMessageToAI(
  message: string,
  sessionId: string | null,
  token: string,
  location: RootState['location']
): Promise<{ reply: string; session_id: string }> {


  try { 
    const response = await http.post(
      `/chat/run`,
      { message, session_id: sessionId, location: location },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else if (status === 422) {
        toast.error('Invalid input. Please check your message and try again.');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(error.response?.data?.detail || 'An unexpected error occurred.');
      }
    } else {
      toast.error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error; // Re-throw the error for further handling if needed
  }
}