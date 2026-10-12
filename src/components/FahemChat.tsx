import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, StudentRecord } from '../types/index.ts';
import { translations } from '../utils/i18n.ts';
import { Bot, X, Send, User, Loader2, ShieldAlert } from 'lucide-react';

interface FahemChatProps {
  student: StudentRecord;
  token?: string;
  lang: Language;
}

export const FahemChat: React.FC<FahemChatProps> = ({ student, token, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome_1',
          sender: 'fahem',
          text: t.fahemWelcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [lang, t.fahemWelcome]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          message: query,
          chatHistory,
          lang,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || (isAr ? 'عذراً، يرجى إعادة المحاولة لاحقاً.' : 'Sorry, please try again shortly.');

      const fahemMsg: ChatMessage = {
        id: `fahem_${Date.now()}`,
        sender: 'fahem',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fahemMsg]);
    } catch (err) {
      console.error('Fahem chat error:', err);
      const errorMsg: ChatMessage = {
        id: `fahem_err_${Date.now()}`,
        sender: 'fahem',
        text: isAr
          ? 'المساعد التربوي غير متوفر مؤقتاً، يرجى المحاولة بعد قليل.'
          : 'Fahem assistant is temporarily unavailable. Please try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [t.q1, t.q2, t.q3, t.q4];

  return (
    <>
      {/* Floating Launcher Button with Liquid Glass styling */}
      <div
        className={`fixed bottom-6 ${
          isAr ? 'left-6' : 'right-6'
        } z-50 transition-transform duration-200 hover:scale-105`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-950/90 dark:bg-zinc-100/95 backdrop-blur-md text-white dark:text-zinc-950 shadow-2xl border border-white/20 dark:border-black/20 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer group"
          aria-label="Open Fahem Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#C5A059]" />
            <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {t.fahemName}
          </span>
        </button>
      </div>

      {/* Chat Drawer / Popover Panel with Liquid Glass aesthetic */}
      {isOpen && (
        <div
          className={`fixed bottom-20 ${
            isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          } z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[calc(100vh-6rem)] liquid-glass rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-zinc-950/95 dark:bg-[#18181B]/95 backdrop-blur-md text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-[#C5A059] border border-zinc-700">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{t.fahemName}</h4>
                <p className="text-[10px] text-zinc-400">
                  {student.nameAr} · {student.fullClass}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close Fahem Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Banner */}
          <div className="px-3 py-1.5 bg-zinc-200/50 dark:bg-zinc-900/60 backdrop-blur-xs text-[10px] text-zinc-600 dark:text-zinc-400 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-[#C5A059] shrink-0" />
            <span className="truncate">{t.fahemPrivacyBadge}</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/40 dark:bg-zinc-950/30">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isUser
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                        : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs border border-zinc-800 dark:border-zinc-300'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-br-xs ltr:rounded-bl-xs'
                        : 'solid-content-surface text-zinc-900 dark:text-zinc-100 shadow-2xs rounded-bl-xs rtl:rounded-br-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-end ${
                        isUser ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <div className="solid-content-surface rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-2xs">
                  <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                  <span className="text-[11px]">{t.fahemThinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Questions */}
          {messages.length < 5 && (
            <div className="px-3 py-2 bg-zinc-100/60 dark:bg-zinc-900/60 border-t border-zinc-200/50 dark:border-zinc-800/50 overflow-x-auto scrollbar-none flex gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-full liquid-glass-interactive text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={t.fahemPlaceholder}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-300/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
