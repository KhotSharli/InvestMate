import { useEffect, useRef } from "react";
import { CircleDollarSign, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageType = "user" | "bot";

interface MessageProps {
  content: string;
  type: MessageType;
  timestamp?: Date;
  isLatest?: boolean;
}

export function ChatMessage({ content, type, timestamp = new Date(), isLatest = false }: MessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Scroll into view when it's the latest message
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLatest]);
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start gap-3 py-4 animate-fade-in transition-opacity",
        type === "bot" ? "opacity-100" : "opacity-100"
      )}
    >
      <div 
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          type === "user" ? "bg-blue-600" : "bg-secondary border border-border"
        )}
      >
        {type === "user" ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {type === "user" ? "You" : "Finance Advisor"}
              </span>
              <span className="text-xs text-muted-foreground">
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div 
              className={cn(
                "rounded-xl px-4 py-3 text-sm",
                type === "user" ? "chat-bubble-user" : "chat-bubble-bot"
              )}
            >
              <div className="prose prose-sm max-w-none">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}