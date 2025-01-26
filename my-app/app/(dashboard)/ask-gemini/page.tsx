import FinancialChatbot from "@/components/financialchatbot";

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Analysis Chatbot</h1>
      <FinancialChatbot />
    </div>
  );
}