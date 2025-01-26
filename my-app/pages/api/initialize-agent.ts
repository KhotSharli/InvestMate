import type { NextApiRequest, NextApiResponse } from "next";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SecApiClient } from "sec-api";

// Store vector stores in memory
const vectorStores = new Map<string, FaissStore>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { ticker } = req.body;

    // Validate the ticker symbol
    if (!ticker || typeof ticker !== "string") {
      return res.status(400).json({ message: "Invalid ticker symbol provided" });
    }

    // Initialize the SEC API client
    const secApi = new SecApiClient(process.env.SEC_API_KEY);

    // Fetch the latest 10-K filing for the given ticker
    const filings = await secApi.filings({
      query: `ticker:${ticker} AND formType:"10-K"`,
      from: "0",
      size: "1",
      sort: [{ filedAt: { order: "desc" } }],
    });

    if (!filings?.filings?.length) {
      return res.status(404).json({ message: `No 10-K filing found for ${ticker}` });
    }

    const filingUrl = filings.filings[0].linkToFilingDetails;

    // Extract sections "1A" and "7"
    const oneaText = await secApi.extract({ url: filingUrl, item: "1A", type: "text" });
    const sevenText = await secApi.extract({ url: filingUrl, item: "7", type: "text" });

    if (!oneaText && !sevenText) {
      return res
        .status(500)
        .json({ message: `Failed to extract 10-K content for ${ticker}` });
    }

    const combinedText = `${oneaText || ""}\n\n${sevenText || ""}`;

    // Initialize embeddings using Hugging Face
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: "BAAI/bge-large-en-v1.5",
    });

    // Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 500,
    });

    const splitDocs = await textSplitter.createDocuments([combinedText]);

    // Create a vector store for the document chunks
    const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

    // Cache the vector store in memory
    vectorStores.set(ticker, vectorStore);

    res.status(200).json({ message: "Agent initialized successfully" });
  } catch (error) {
    console.error("Error initializing agent:", error);
    res.status(500).json({
      message: "Failed to initialize agent",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}