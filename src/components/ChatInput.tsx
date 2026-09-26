import React, { useState, KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full pt-4 pb-2 relative z-20">
      <div className="relative flex items-end w-full rounded-2xl bg-[#111111] border border-white/10 shadow-2xl transition-all focus-within:border-blue-500/50 focus-within:bg-[#151515]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a nutrition question..."
          className="w-full max-h-32 min-h-[56px] py-4 pl-5 pr-14 bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#333]"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-2 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-blue-600/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <SendHorizontal size={20} className={input.trim() ? "text-blue-500" : ""} />
        </button>
      </div>
      <p className="text-[10px] text-center text-gray-600 mt-3 font-medium uppercase tracking-widest">
        Milestone 1 — Prototype Without Retrieval
      </p>
    </div>
  );
};
