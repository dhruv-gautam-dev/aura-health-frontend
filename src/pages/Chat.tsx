import React, { useState, useEffect, useRef, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Sparkles, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';

import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import { chatApi } from '../api';
import ConnectionStatus from '../components/chat/ConnectionStatus';

type Role = 'user' | 'assistant';

interface Message {
    id: number;
    role: Role;
    content: string;
    attachments?: string[];
    mode: string;
}

export default function Chat(): JSX.Element {
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [connectionMode, setConnectionMode] = useState<string>('cloud');
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        setConnectionMode(isOnline ? 'cloud' : 'offline');
    }, [isOnline]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialMessage = params.get('initial');
        if (initialMessage) {
            handleSend(initialMessage, []);
            window.history.replaceState({}, '', createPageUrl('Chat'));
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (
        content: string,
        attachments: string[] = []
    ): Promise<void> => {
        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content,
            attachments,
            mode: connectionMode,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const conversationHistory = messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n');

        const prompt = `You are Aura, a friendly and knowledgeable AI medical companion. You help users track their medications, understand health information, and provide supportive guidance.

Guidelines:
- Be empathetic and supportive
- Provide clear, helpful health information
- Always recommend consulting a healthcare professional for medical decisions
- Use markdown formatting for lists, tables, and emphasis
- Keep responses concise but thorough

Previous conversation:
${conversationHistory}

User: ${content}

${attachments.length > 0
                ? 'The user has attached an image. Describe what you see and provide relevant guidance.'
                : ''
            }

Respond helpfully:`;

        const response: string = await chatApi.invokeLLM({
            prompt,
            file_urls: attachments.length > 0 ? attachments : undefined,
        });

        const assistantMessage: Message = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response,
            mode: connectionMode,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        await chatApi.createMessage({
            role: 'user',
            content,
            mode: connectionMode,
            attachments,
        });

        await chatApi.createMessage({
            role: 'assistant',
            content: response,
            mode: connectionMode,
        });

        setIsLoading(false);
    };

    const handleImageCapture = (file: File): void => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('scan') === 'prescription') {
            navigate(createPageUrl('ScanPrescription'));
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-xl"
                            onClick={() => navigate(createPageUrl('Home'))}
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-slate-800 text-sm">Aura</h1>
                                <ConnectionStatus mode={connectionMode} />
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                    </Button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center px-8"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Hi, I'm Aura
                        </h2>

                        <p className="text-slate-500 text-sm max-w-[280px]">
                            Your AI health companion. Ask me about symptoms, medications, or share how you're feeling today.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {[
                                'What are the side effects of Amoxicillin?',
                                'I have a persistent headache',
                                'Help me understand my prescription',
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSend(suggestion, [])}
                                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 
                             text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300
                             transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <ChatBubble key={message.id} message={message} />
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 border border-slate-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                                        <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                                        <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                onImageCapture={handleImageCapture}
            />
        </div>
    );
}