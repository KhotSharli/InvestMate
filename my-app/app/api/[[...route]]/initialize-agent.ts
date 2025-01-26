import type { NextApiRequest, NextApiResponse } from 'next';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

import { SecApiClient } from 'sec-api';

const vectorStores = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { ticker } = req.body;

    // Validate the ticker symbol
    if (!ticker || typeof ticker !== 'string') {
      return res.status(400).json({ message: 'Invalid ticker symbol provided' });
    }

    // Initialize the SEC API client
    const secApi = new SecApiClient(process.env.SEC_API_KEY);

    // Get the most recent 10-K filing
    const filings = await secApi.filings({
      query: {
        query: `ticker:${ticker} AND formType:"10-K"`,
        from: '0',
        size: '1',
        sort: [{ filedAt: { order: 'desc' } }],
      },
    });

    // Check if filings were found
    if (!filings.filings || filings.filings.length === 0) {
      return res.status(404).json({ message: `No 10-K filing found for ${ticker}` });
    }

    // Get the filing URL for extracting sections
    const filingUrl = filings.filings[0].linkToFilingDetails;

    // Extract relevant sections from the 10-K filing
    const oneaText = await secApi.extract({
      url: filingUrl,
      item: '1A',
      type: 'text',
    });

    const sevenText = await secApi.extract({
      url: filingUrl,
      item: '7',
      type: 'text',
    });

    const combinedText = `${oneaText}\n\n${sevenText}`;

    // Initialize embeddings using Hugging Face model
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: 'BAAI/bge-large-en-v1.5',
    });

    // Split the combined text into smaller chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 500,
    });

    const splitDocs = await textSplitter.createDocuments([combinedText]);

    // Create a FAISS vector store from the split documents
    const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    vectorStores.set(ticker, vectorStore);

    // Return success message
    res.status(200).json({ message: `Agent initialized successfully for ${ticker}` });
  } catch (error) {
    console.error('Error initializing agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Failed to initialize agent',
      error: errorMessage,
    });
  }
}

// API configuration to handle larger payloads and responses
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: false,
  },
};