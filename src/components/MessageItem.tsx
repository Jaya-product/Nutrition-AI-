import React from 'react';
import { Message } from './ChatLayout';
import { User, Sparkles, AlertTriangle } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group animate-[fade-in_0.3s_ease-out_forwards]`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm ${
          isUser 
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
            : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {isUser ? <User size={20} /> : <Sparkles size={20} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-colors ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm shadow-blue-900/20' 
              : 'bg-[#1a1a1a] text-gray-200 border border-white/5 rounded-tl-sm hover:border-white/10'
          }`}>
            {message.content}
          </div>

          {/* Claims Display (Milestone 1 specific feature) */}
          {!isUser && message.claims && message.claims.length > 0 && (
            <div className="mt-2 w-full flex flex-col gap-2">
              {message.claims.map((c, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#121212] border border-orange-500/20 rounded-lg p-3 text-sm text-gray-400">
                  <AlertTriangle size={16} className="text-orange-500/70 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-medium">Claim identified:</span>
                    <span className="italic">"{c.claim}"</span>
                    <span className="text-xs text-orange-500/60 mt-1 uppercase tracking-wider font-semibold">Source: Null</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
