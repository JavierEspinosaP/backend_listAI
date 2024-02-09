import { Request, Response } from 'express';
import { processAudioWithWhisper } from '../utils/processAudioWithWhisper';
import { getSongsFromChatGPT } from '../utils/getSongsFromChatGPT';
import {getAccessToken} from '../utils/getAccessToken';
import {getURIofSongs} from '../utils/getURIofSongs';
import {getUserId, createPlaylist, addTracksToPlaylist} from '../services/spotifyService';
import {getUserAccessToken} from '../utils/getUserAccessToken';
import {getPlaylistNameAndDescription} from '../utils/getPlaylistNameAndDescription';


export const processAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se encontró el archivo de audio.');
    }

    const audioBuffer = req.file.buffer;

    const transcribedText = await processAudioWithWhisper(audioBuffer);

    const songsList = await getSongsFromChatGPT(transcribedText)

    const playlistNameAndDescription = await getPlaylistNameAndDescription(transcribedText)

    // const accessToken = await getAccessToken()    
    
    // const userAccessToken = await getUserAccessToken()

    const URIofSongs = await getURIofSongs(songsList, req.body.access_token)

    const userId = await getUserId(req.body.access_token)

    const playlist = await createPlaylist(userId, playlistNameAndDescription[0], playlistNameAndDescription[1], req.body.access_token)

    const addTracks = await addTracksToPlaylist(playlist, URIofSongs, req.body.access_token)

    res.status(200).json(addTracks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar el archivo de audio.');
  }
};
