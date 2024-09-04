import axios from 'axios';
import FormData from 'form-data';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

// URL de la API de transcripciones de audio de OpenAI
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

// Función para obtener la duración del audio en segundos
const getAudioDuration = (audioBuffer: Buffer): Promise<number> => {
  return new Promise((resolve, reject) => {
    // Crear un archivo temporal desde el buffer
    const tempFilePath = './temp_audio.webm';
    fs.writeFileSync(tempFilePath, audioBuffer);

    ffmpeg.ffprobe(tempFilePath, (err: Error | null, metadata: any) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }

      // Eliminar el archivo temporal después de obtener la duración
      fs.unlinkSync(tempFilePath);
    });
  });
};

export const processAudioWithWhisper = async (audioBuffer: Buffer): Promise<string> => {
  try {
    // Obtener la duración del archivo de audio
    const duration = await getAudioDuration(audioBuffer);

    // Verificar si la duración es mayor a 1 segundo
    if (duration < 1) {
      throw new Error('El archivo de audio es demasiado corto (menos de 1 segundo).');
    }

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
    return response.data.text;
  } catch (error) {
    console.error('Error al procesar el audio con Whisper:', error);
    throw error;
  }
};
