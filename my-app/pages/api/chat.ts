import type { NextApiRequest, NextApiResponse } from "next";

// Ensure `vectorStores` is imported or accessible
import vectorStores from "./initialize-agent"; // Ensure correct path based on your file structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { question, ticker } = req.body;

  try {
    if (!question || typeof question !== "string" || !ticker || typeof ticker !== "string") {
      return res.status(400).json({ message: "Invalid question or ticker symbol provided" });
    }

    console.log("Received question:", question, "for ticker:", ticker);

    // Check if the vector store for the given ticker exists
    const vectorStore = vectorStores.get(ticker);
    if (!vectorStore) {
      throw new Error("Vector store not initialized for the provided ticker.");
    }

    // Retrieve relevant documents from the vector store
    const retriever = vectorStore.asRetriever();
    const contextDocs = await retriever.getRelevantDocuments(question);

    const context = contextDocs.map((doc) => doc.pageContent).join("\n");
    console.log("Retrieved context:", context);

    // Send the question and context to your model endpoint
    const response = await fetch(process.env.MODEL_ENDPOINT!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error(`Model endpoint error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Model response:", data);

    res.status(200).json({ response: data.response });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({
      message: "Failed to process chat",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
