import React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string; // User's text or AI's answer field
  claims?: any[];
  source?: null;
}

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-100 font-sans overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="flex w-full h-full max-w-7xl mx-auto p-4 md:p-6 gap-6 relative z-10">
        {children}
      </div>
    </div>
  );
};
