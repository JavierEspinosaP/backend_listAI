import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1/search';

// Función para separar el título de la canción y el nombre del artista.
function splitSongAndArtist(song: string): { track: string, artist: string } {
    const [track, artist] = song.split(' - ').map(s => s.trim());
    return { track, artist };
}

function generateQuery(artist: string, track: string) {
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
        // const query = `artist%3A${encodeURIComponent(artist)}+track%3A${encodeURIComponent(track)}`;
        const query = generateQuery(artist, track)
        
        try {
            const response = await axios.get(`${BASE_URL}?q=${query}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data.tracks.items.length > 0) {
                uris.push(response.data.tracks.items[0].uri);
            }
        } catch (error) {
            console.error(`Error al buscar la canción ${song}:`, error);
        }
    }

    return uris;
}

// Ejemplo de uso de la función.
const accessToken = 'tu_token_de_acceso'; // Reemplaza esto con tu token de acceso real
const songsToSearch = [
    "Island in the Sun - Weezer",
    "Lovely Day - Bill Withers",
    "Three Little Birds - Bob Marley",
    "Soak Up the Sun - Sheryl Crow"
];
