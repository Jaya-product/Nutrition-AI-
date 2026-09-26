"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Sprout, LogOut, X, Menu, BookOpen, ArrowUp, FileText } from "lucide-react";

// --- Types & Data ---

type Claim = { claim: string; source: null };
type Message = { id: string; role: "user" | "assistant"; content: string; claims?: Claim[] };
type Chat = { id: string; title: string; group: string; messages: Message[] };

const user = { name: "Jaya Manocha", initials: "JM" };

const starters = [
  "How much protein do vegetarians need?",
  "Can I safely reheat rice the next day?",
  "Is air frying healthier than deep frying?",
];

// --- Components ---

function Sidebar({ chats, activeId, open, onClose, onSelect, onNewChat }: any) {
  const groups = ["Today", "Previous 7 days"];

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-slate-900/20 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Sprout size={18} />
            </div>
            <span className="text-lg font-semibold">Sprout</span>
          </div>
          <button onClick={onClose} className="text-slate-500 md:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-5">
          <button
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 cursor-pointer"
          >
            <Plus size={16} /> New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          {groups.map((group) => {
            const items = chats.filter((c: Chat) => c.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-5">
                <p className="px-2 pb-2 text-xs font-medium text-slate-500">{group}</p>
                {items.map((chat: Chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelect(chat.id)}
                    className={`block w-full truncate rounded-xl px-3 py-2 text-left text-sm cursor-pointer transition-colors ${
                      chat.id === activeId ? "bg-emerald-50 text-emerald-700 font-medium" : "hover:bg-slate-100"
                    }`}
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">
            {user.initials}
          </div>
          <span className="flex-1 truncate text-sm">{user.name}</span>
          <button className="text-slate-500 hover:text-slate-800 cursor-pointer" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

function MessageBubble({ role, content }: any) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-br-md bg-emerald-500 px-4 py-3 text-sm leading-relaxed text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Sprout size={16} />
      </div>
      <div className="max-w-[80%] whitespace-pre-line rounded-2xl rounded-tl-md bg-white border border-slate-100 px-4 py-3 text-sm leading-relaxed shadow-sm">
        {content}
      </div>
    </div>
  );
}

function ChatInput({ onSend, isGenerating }: any) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !isGenerating;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="px-4 pb-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 focus-within:border-emerald-500 transition-colors shadow-sm">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={isGenerating ? "Sprout is thinking..." : "Ask about protein, leftovers or cooking..."}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!canSend}
            aria-label="Send"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${
              canSend ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md" : "bg-slate-100 text-slate-400"
            }`}
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Sprout can make mistakes. Check important nutrition or medical advice with a professional.
        </p>
      </div>
    </div>
  );
}

function ChatArea({ chat, onSend, onOpenSidebar, onToggleSources, sourcesOpen, isGenerating }: any) {
  const endRef = useRef<HTMLDivElement>(null);
  const messages = chat?.messages ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isGenerating]);

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
        <button onClick={onOpenSidebar} className="text-slate-500 md:hidden cursor-pointer" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="flex-1 truncate text-sm font-medium">
          {messages.length ? chat.title : "AI Nutrition Assistant"}
        </h1>
        <button
          onClick={onToggleSources}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm cursor-pointer transition-colors ${
            sourcesOpen ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <BookOpen size={16} /> Sources
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center pt-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                <Sprout size={22} />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">What's on your plate today?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Ask about nutrients, leftovers or cooking methods.
              </p>
              <div className="mt-8 w-full max-w-md space-y-2">
                {starters.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSend(q)}
                    disabled={isGenerating}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:border-emerald-500 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m: Message) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {isGenerating && (
                 <div className="flex gap-3">
                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                     <Sprout size={16} />
                   </div>
                   <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white border border-slate-100 px-4 py-3 shadow-sm flex items-center gap-1">
                     <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                 </div>
              )}
            </>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <ChatInput onSend={onSend} isGenerating={isGenerating} />
    </main>
  );
}

function SourcesPanel({ chat, open, onClose }: any) {
  if (!open) return null;
  const allClaims: Claim[] = (chat?.messages ?? []).flatMap((m: Message) => m.claims ?? []);

  return (
    <aside className="fixed inset-y-0 right-0 z-30 flex w-80 flex-col border-l border-slate-200 bg-white lg:static shadow-xl lg:shadow-none">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
        <h2 className="text-sm font-medium">Sources</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 cursor-pointer" aria-label="Close sources">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5 bg-gray-50/30">
        {allClaims.length === 0 ? (
          <p className="text-sm text-slate-500">Sources for answers in this chat will appear here.</p>
        ) : (
          allClaims.map((c, i) => (
            <div key={i} className="flex gap-3 rounded-2xl border border-slate-200 p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-medium text-emerald-700">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-slate-800">{c.claim}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <FileText size={12} /> {c.source === null ? "null" : c.source}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

// --- Main Export ---

export default function AI_Nutrition_App() {
  const [chats, setChats] = useState<Chat[]>([
    { id: "c1", title: "New chat", group: "Today", messages: [] }
  ]);
  const [activeId, setActiveId] = useState("c1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeChat = chats.find((c) => c.id === activeId);

  const newChat = () => {
    const chat: Chat = { id: `c${Date.now()}`, title: "New chat", group: "Today", messages: [] };
    setChats([chat, ...chats]);
    setActiveId(chat.id);
    setSidebarOpen(false);
  };

  const sendMessage = async (text: string) => {
    const userMsg: Message = { id: `m${Date.now()}`, role: "user", content: text };
    
    // Add user message immediately
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, title: c.messages.length ? c.title : text, messages: [...c.messages, userMsg] }
          : c
      )
    );
    
    setIsGenerating(true);

    try {
      const currentChat = chats.find(c => c.id === activeId);
      const prevMessages = currentChat?.messages || [];
      const apiMessages = [...prevMessages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat` : "/api/chat";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      
      const aiMsg: Message = {
        id: `m${Date.now()}`,
        role: "assistant",
        content: data.answer || "I'm sorry, I couldn't generate a response.",
        claims: data.claims || []
      };

      setChats((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );
    } catch (error) {
      console.error(error);
      const errMsg: Message = {
        id: `err${Date.now()}`,
        role: "assistant",
        content: "An error occurred connecting to the server. Please try again later."
      };
      setChats((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, errMsg] } : c))
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-800 font-sans">
      <Sidebar
        chats={chats}
        activeId={activeId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(id: string) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNewChat={newChat}
      />
      <ChatArea
        chat={activeChat}
        onSend={sendMessage}
        onOpenSidebar={() => setSidebarOpen(true)}
        onToggleSources={() => setSourcesOpen((o: boolean) => !o)}
        sourcesOpen={sourcesOpen}
        isGenerating={isGenerating}
      />
      <SourcesPanel chat={activeChat} open={sourcesOpen} onClose={() => setSourcesOpen(false)} />
    </div>
  );
}
