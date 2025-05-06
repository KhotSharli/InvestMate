"use client";
import { SetStateAction, useState } from "react";
import { FinanceChatHeader } from "@/components/FinanceChatHeader";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatContainers } from "@/components/ChatContainers"; 
import { FinanceTopics } from "@/components/FinanceTopics";

const Index = () => {
  const [modelChoice, setModelChoice] = useState("rag"); // Default to "gemini"

  const handleModelChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setModelChoice(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto">
        <header className="px-4 md:px-8 pt-8">
          <FinanceChatHeader />
          <FinanceTopics />
        </header>
        
        <main className="flex-1 flex flex-col mt-4 md:mt-6 mb-4 overflow-hidden">
          <div className="glass-panel flex-1 rounded-xl border border-border shadow-subtle overflow-hidden">
            <div className="px-4 py-2">
              <label className="mr-4">Choose Model:</label>
              <select
                value={modelChoice}
                onChange={handleModelChange}
                className="p-2 border rounded"
              >
                <option value="rag">RAG Model</option>
                <option value="gemini">Gemini Model</option>
              </select>
            </div>
            {/* Conditional rendering based on the user's selection */}
            {modelChoice === "rag" ? (
              <ChatContainer />
            ) : (
              <ChatContainers />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
