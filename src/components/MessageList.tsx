import React, { useEffect, useRef } from 'react';
import { Message } from './ChatLayout';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestedClick?: (content: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onSuggestedClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto w-full px-2 py-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 opacity-70">
          <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-xl font-medium text-gray-300 mb-2">AI Nutrition Assistant</h3>
          <p className="max-w-sm text-sm text-gray-400">
            Ask me anything about food, nutrition, safety, and cooking. 
          </p>
          <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
            <button 
              onClick={() => onSuggestedClick?.("How much protein does a vegetarian adult need?")}
              className="bg-[#1a1a1a] p-3 rounded-lg border border-white/5 text-xs text-left text-gray-400 flex items-center gap-3 hover:bg-[#222] transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              "How much protein does a vegetarian adult need?"
            </button>
            <button 
              onClick={() => onSuggestedClick?.("Is it safe to eat chicken left out overnight?")}
              className="bg-[#1a1a1a] p-3 rounded-lg border border-white/5 text-xs text-left text-gray-400 flex items-center gap-3 hover:bg-[#222] transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
              "Is it safe to eat chicken left out overnight?"
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full pb-4">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex w-full justify-start mb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <span className="animate-pulse">●</span>
                </div>
                <div className="bg-[#1a1a1a] px-5 py-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
