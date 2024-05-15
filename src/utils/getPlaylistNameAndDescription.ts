import axios from 'axios';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions'; // URL de la API de ChatGPT
const OPENAI_API_KEY = process.env.OPENAI_APIKEY; // Reemplaza con tu clave API de OpenAI

export const getPlaylistNameAndDescription = async (text: string): Promise<string[]> => {
    try {
      const response = await axios.post(
        CHATGPT_API_URL,
        {
          model: 'gpt-3.5-turbo', // o el modelo que desees utilizar
          messages: [
            {
              role: 'user',
              content: `Basado en el siguiente texto: ${text}, por favor genera un título y una descripción original pero simple para una lista de reproducción de Spotify, no hables sobre las canciones que la componen ya que no las sabes, el formato debe ser convertible a JSON con la siguiente estructura: {"titulo": "titulo de la playlist", "descripcion": "descripcion de la playlist"}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_APIKEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Procesa la respuesta para extraer el título y la descripción
      const chatResponse = response.data.choices[0].message.content;
  
      // Asumiendo que chatResponse es un string JSON válido
      const jsonResponse = JSON.parse(chatResponse);
  
      const titulo = jsonResponse.titulo;
      const descripcion = jsonResponse.descripcion;
  
      // Retorna un array con el título y la descripción
      return [titulo, descripcion];
    } catch (error) {
      console.error('Error al obtener canciones de ChatGPT:', error);
      throw error;
    }
  };

  
