import { Request, Response } from 'express';
import { processAudioWithWhisper } from '../utils/processAudioWithWhisper';


export const processAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se encontró el archivo de audio.');
    }

    const audioPath = req.file.buffer;
    console.log(req.file);
    
    const transcribedText = await processAudioWithWhisper(audioPath);

    res.status(200).json(transcribedText);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar el archivo de audio.');
  }
};
