// src/api/businessNews.ts

export const fetchBusinessNews = async () => {
    const apiKey = 'pub_567256d65f2d0d54323593329553c2619714d';
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=business%20news&country=in&language=en,hi&category=business`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.results; // Adjust this based on the actual response structure
    } catch (error) {
      console.error('Error fetching business news:', error);
      throw error; // Rethrow to handle it in the component
    }
  };
  