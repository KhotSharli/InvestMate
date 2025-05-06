import { ArrowUpRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FinanceChatHeader() {
  return (
    <div className="flex flex-col space-y-2 mb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">F</span>
          </div>
          <h1 className="text-xl font-display font-medium text-foreground">Finance Advisor</h1>
          <div className="hidden md:flex items-center">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-success/10 text-success">
              Live
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">About</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Finance advisor chatbot</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <span>Help</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm max-w-2xl">
        Ask me any finance-related questions about markets, investments, banking, or economic insights. I'm here to help.
      </p>
    </div>
  );
}