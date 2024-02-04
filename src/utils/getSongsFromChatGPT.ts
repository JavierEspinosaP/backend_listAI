import axios from 'axios';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions'; // URL de la API de ChatGPT
const OPENAI_API_KEY = 'tu_api_key'; // Reemplaza con tu clave API de OpenAI

export const getSongsFromChatGPT = async (text: string): Promise<string[]> => {
  try {
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-4', // o el modelo que desees utilizar
        messages: [
          {
            role: 'user',
            content: `Basado en el siguiente texto: '${text}', por favor genera una lista de 20 canciones que encajen con su sentimiento, interpretación o significado,
            el formato de respuesta debe ser el siguiente, no debe haber nada más en la respuesta: "Cancion - Autor, cancion - autor...`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Procesa la respuesta para extraer las canciones
    const chatResponse = response.data.choices[0].message.content;
    const songs = extractSongsFromResponse(chatResponse);

    return songs;
  } catch (error) {
    console.error('Error al obtener canciones de ChatGPT:', error);
    throw error;
  }
};

const extractSongsFromResponse = (response: string): string[] => {
    const songList = [];
    const lines = response.split('\n'); // Divide la respuesta en líneas
  
    for (let line of lines) {
      const trimmedLine = line.trim();
  
      if (trimmedLine) {
        // Busca un patrón para identificar los nombres de las canciones
        // Esto depende de cómo ChatGPT formatea la lista
        // Por ejemplo, si cada línea es una canción:
        songList.push(trimmedLine);
      }
    }
  
    return songList;
  };
  
