export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { question } = req.body;
  
      // Mock response for demonstration (replace this with real AI API call)
      const answer = `Here’s what I found about "${question}": This is a sample response generated by the backend.`;
  
      res.status(200).json({ answer });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  