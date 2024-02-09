import axios from 'axios';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions'; // URL de la API de ChatGPT
const OPENAI_API_KEY = process.env.OPENAI_APIKEY; // Reemplaza con tu clave API de OpenAI

export const getSongsFromChatGPT = async (text: string): Promise<string[]> => {
  try {
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: 'gpt-4', // o el modelo que desees utilizar
        messages: [
          {
            role: 'user',
            content: `Basado en el siguiente texto: ${text}, por favor genera una lista de 20 canciones que encajen con su sentimiento, interpretación o significado, no bases la elección simplemente en las palabras que contenga la frase, el formato de respuesta debe ser el siguiente, no debe haber nada más en la respuesta: "Canción - Autor, Canción - Autor...`
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
  // Elimina las comillas al principio y al final, si las hay
  const cleanedResponse = response.replace(/^"|"$/g, '');

  // Divide la respuesta por comas para obtener cada canción
  const songs = cleanedResponse.split(',').map(song => song.trim());

  return songs;
};

  
