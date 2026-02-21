import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  attachments?: string[];
}

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 
                     flex items-center justify-center flex-shrink-0 mt-1"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`
            rounded-2xl px-4 py-3 
            ${
              isUser
                ? 'bg-slate-800 text-white rounded-tr-md'
                : 'bg-white border border-slate-100 shadow-sm rounded-tl-md'
            }
          `}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="text-sm text-slate-700 prose prose-sm max-w-none
                         prose-headings:text-slate-800 prose-headings:font-semibold
                         prose-p:text-slate-700 prose-p:leading-relaxed
                         prose-strong:text-slate-800 prose-strong:font-semibold
                         prose-ul:my-2 prose-li:my-0.5
                         prose-table:text-xs prose-th:bg-slate-50 prose-th:p-2
                         prose-td:p-2 prose-td:border-slate-200">
              <ReactMarkdown
                components={{
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3 rounded-lg border border-slate-200">
                      <table className="w-full">{children}</table>
                    </div>
                  ),
                  code(props: any) {
                    const { inline, children } = props;
                    return inline ? (
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-cyan-700 text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto my-2 text-xs">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && message.mode && (
          <div className="mt-1.5 ml-1">
            <ConnectionStatus mode={message.mode} />
          </div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Attachment"
                className="w-20 h-20 rounded-lg object-cover border border-slate-200"
              />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </motion.div>
  );
}