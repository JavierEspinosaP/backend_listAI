import axios from "axios";

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions"; 

export const getSongsFromChatGPT = async (text: string): Promise<string[]> => {
  try {
    const response = await axios.post(
      CHATGPT_API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres un dj experimentado. Basado en el siguiente texto: ${text}, genera una lista de 50 canciones que encajen con el contexto de la frase, deben ser canciones que existan en Spotify, sé original en las recomendaciones, el formato de respuesta debe ser como el ejemplo siguiente:
"No Surprises - Radiohead, The Night We Met - Lord Huron, Holocene - Bon Iver, Breathe Me - Sia, Slowdive - Beach Fossils, The Less I Know The Better - Tame Impala"
No debe haber absolutamente nada más en su respuesta`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Procesa la respuesta para extraer las canciones
    const chatResponse = response.data.choices[0].message.content;
    const songs = extractSongsFromResponse(chatResponse);

    return songs;
  } catch (error) {
    console.error("Error al obtener canciones de ChatGPT:", error);
    throw error;
  }
};

const extractSongsFromResponse = (response: string): string[] => {
  // Elimina las comillas al principio y al final, si las hay
  const cleanedResponse = response.replace(/^"|"$/g, "");

  // Divide la respuesta por comas para obtener cada canción
  const songs = cleanedResponse.split(",").map((song) => song.trim());

  return songs;
};
