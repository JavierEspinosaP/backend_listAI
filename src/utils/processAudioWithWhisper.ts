import axios from 'axios';
import FormData from 'form-data';

// URL de la API de transcripciones de audio de OpenAI
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

export const processAudioWithWhisper = async (audioBuffer: Buffer): Promise<string> => {
  try {
    // Preparar los datos del formulario
    const model = 'whisper-1';

    const formData = new FormData();
    formData.append('model', model);
    formData.append('file', audioBuffer, 'audio.webm');
    
    // Llamada a la API de OpenAI
    const response = await axios.post(WHISPER_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_APIKEY}`,
        ...formData.getHeaders() // Encabezados necesarios para el envío de FormData
      },
      params: {
        'response_format': 'text' // Formato de respuesta deseado
      }
    });

    // Procesar y devolver la respuesta
    return response.data.text; // Ajusta esto según la estructura exacta de la respuesta
  } catch (error) {
    console.error('Error al procesar el audio con Whisper:', error);
    throw error;
  }
};
