import axios from 'axios';

export const getUserId = async (accessToken: string): Promise<string> => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        console.log(response);
        
        return response.data.id
    } catch (error:any) {
        console.log('Error al traer user_id', error);
        return error
    }
}

export const createPlaylist = async (userId: string, playlistName: string, playlistDescription: string, accessToken: string): Promise<string> => {
    try {
        console.log(accessToken);
        
        const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: playlistName,
            description: playlistDescription,
            public: false,
        }, {         
            headers: {
            'Authorization': `Bearer ${accessToken}`
        } });

        return response.data.uri;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
};

export const addTracksToPlaylist = async (playlistUri: string, trackUris: string[], accessToken: string): Promise<void> => {
    try {
        const playlistId = playlistUri.split(':')[2];
        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: trackUris,
        }, {         headers: {
            'Authorization': `Bearer ${accessToken}`
        } });
    } catch (error) {
        console.error('Error adding tracks to playlist:', error);
        throw error;
    }
};
