import { Request, Response } from 'express';
import { processAudioWithWhisper } from '../utils/processAudioWithWhisper';
import { getSongsFromChatGPT } from '../utils/getSongsFromChatGPT';
import {getURIofSongs} from '../utils/getURIofSongs';
import {getUserId, createPlaylist, addTracksToPlaylist} from '../services/spotifyService';
import {getPlaylistNameAndDescription} from '../utils/getPlaylistNameAndDescription';


export const processAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se encontró el archivo de audio.');
    }    
    
    const audioBuffer = req.file.buffer;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Token de acceso no proporcionado o inválido.');
    }
    const accessToken = authHeader.split(' ')[1]; // Extrae el token después de 'Bearer '    

    const transcribedText = await processAudioWithWhisper(audioBuffer);

    const songsList = await getSongsFromChatGPT(transcribedText);

    const playlistNameAndDescription = await getPlaylistNameAndDescription(transcribedText);

    // Usa el accessToken extraído del header para las siguientes operaciones
    const URIofSongs = await getURIofSongs(songsList, accessToken);

    const userId = await getUserId(accessToken);

    const playlist = await createPlaylist(userId, playlistNameAndDescription[0], playlistNameAndDescription[1], accessToken);

    const addTracks = await addTracksToPlaylist(playlist, URIofSongs, accessToken);

    res.status(200).json(addTracks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar el archivo de audio.');
  }
};
