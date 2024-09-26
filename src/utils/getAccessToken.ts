import axios from 'axios';

const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET;

export const getAccessToken = async(): Promise<any> => {
  const params = new URLSearchParams({
    'grant_type': 'client_credentials'
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
  };

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
}
