import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { Button, Textarea } from "@/components";
import { useClearChat, useSendMessage } from "@/hooks";
import { cn } from "@/lib";
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  text: string;
}

const MAX_MESSAGE_LENGTH = 500;
const ERROR_FALLBACK = "Something went wrong. Please try again.";

const SUGGESTIONS = [
  "What's due this week?",
  "What classes do I have today?",
  "Which tasks haven't I finished yet?",
];

const bubbleStyles = {
  user: "self-end bg-blue-600 text-white whitespace-pre-wrap",
  assistant: "self-start bg-slate-100 text-slate-900",
  error: "self-start bg-red-50 text-red-700 whitespace-pre-wrap",
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { mutate: clearChat } = useClearChat();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    clearChat();
  }, [clearChat]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isPending, isOpen]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
  }, [input, isOpen]);

  const send = (text: string) => {
    const message = text.trim();
    if (!message || isPending) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");

    sendMessage(message, {
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      },
      onError: (error) => {
        setMessages((prev) => [
          ...prev,
          { role: "error", text: error.message || ERROR_FALLBACK },
        ]);
      },
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const startNewChat = () => {
    clearChat();
    setMessages([]);
    setInput("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:inset-auto md:bottom-24 md:right-6 md:z-40 md:h-[32rem] md:w-96 md:overflow-hidden md:rounded-xl md:border md:border-slate-200 md:shadow-2xl">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <p className="font-semibold">Due-It Assistant</p>
            <div className="flex items-center gap-1">
              <button
                onClick={startNewChat}
                disabled={isPending || messages.length === 0}
                title="New chat"
                aria-label="New chat"
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col justify-end gap-2">
                <p className="mb-2 text-sm text-slate-600">
                  Hi! I can look up your tasks, schedules and materials, mark
                  tasks as done, and help manage your workspaces. Try asking:
                </p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    className="cursor-pointer rounded-lg border border-blue-600 px-3 py-2 text-left text-sm text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] break-words rounded-xl px-3 py-2 text-sm",
                      bubbleStyles[message.role]
                    )}
                  >
                    {message.role === "assistant" ? (
                      <ChatMarkdown text={message.text} />
                    ) : (
                      message.text
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="flex gap-1 self-start rounded-xl bg-slate-100 px-3 py-3">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                maxLength={MAX_MESSAGE_LENGTH}
                rows={1}
                className="h-auto max-h-32 min-h-0 flex-1"
              />
              <Button
                size="icon"
                onClick={() => send(input)}
                disabled={isPending || !input.trim()}
                aria-label="Send message"
              >
                <Send />
              </Button>
            </div>
            <p
              className={cn(
                "mt-1 text-right text-xs",
                input.length >= MAX_MESSAGE_LENGTH
                  ? "text-red-600"
                  : "text-slate-500"
              )}
            >
              {input.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-6 right-6 z-30 h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700",
          isOpen ? "hidden md:flex" : "flex"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}

export default ChatWidget;
