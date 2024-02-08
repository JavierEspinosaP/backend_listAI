import axios from 'axios';

export const getUserAccessToken = async (code: string): Promise<string> => {
  try {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI as string);
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID as string);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET as string);

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso', error);
    throw error;
  }
};
