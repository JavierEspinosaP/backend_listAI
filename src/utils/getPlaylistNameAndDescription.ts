import axios from 'axios';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getPlaylistNameAndDescription = async (text: string): Promise<string[]> => {
    try {
      const response = await axios.post(
        CHATGPT_API_URL,
        {
          model: 'gpt-4o-mini', 
          messages: [
            {
              role: 'user',
              content: `Basado en el siguiente texto: ${text}, genera un título y una descripción original pero simple para una lista de reproducción de Spotify, no hables sobre las canciones que la componen, el formato debe ser convertible a JSON con la siguiente estructura: {"titulo": "titulo de la playlist", "descripcion": "descripcion de la playlist"}`
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

  
