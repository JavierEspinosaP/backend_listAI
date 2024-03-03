import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1/search';

// Función para separar el título de la canción y el nombre del artista.
function splitSongAndArtist(song: string): { track: string, artist: string } {
    const [track, artist] = song.split(' - ').map(s => s.trim());
    return { track, artist };
}

function generateQuery(artist: string, track: string) {
    // Asegura que artist no sea undefined antes de intentar realizar el replace
    if (typeof artist === 'undefined' || typeof track === 'undefined') {
        console.error('Artist or track is undefined, check the input data');
        return ''; // Retorna una cadena vacía o maneja este caso como mejor te parezca
    }
    
    // Elimina los puntos finales en el nombre del artista
    artist = artist.replace(/\.$/, '');

    // Reemplaza espacios con '+' y codifica los componentes de la URI
    let encodedArtist = encodeURIComponent(artist).replace(/%20/g, '+');
    let encodedTrack = encodeURIComponent(track).replace(/%20/g, '+');

    // Construye la consulta
    return `artist%3A+${encodedArtist}+track%3A+${encodedTrack}`;
}

// La función para buscar las canciones.
export const getURIofSongs = async (songs: string[], accessToken: string): Promise<string[]> => {
    const uris: string[] = [];

    for (const song of songs) {
        const { track, artist } = splitSongAndArtist(song);
        const query = generateQuery(artist, track);
        
        if (!query) {
            console.error(`Skipping song due to missing data: ${song}`);
            continue; // O maneja este caso como prefieras, pero aquí se continúa con el siguiente elemento.
        }

        try {
            const response = await axios.get(`${BASE_URL}?q=${query}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data.tracks.items.length > 0) {
                uris.push(response.data.tracks.items[0].uri);
            } else {
                console.log(`No se encontró la canción: ${song}`);
                // Aquí puedes decidir si quieres hacer algo cuando no se encuentra la canción.
            }
        } catch (error) {
            console.error(`Error al buscar la canción ${song}:`, error);
        }
    }

    return uris;
}
