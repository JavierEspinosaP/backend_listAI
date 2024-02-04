import multer from 'multer';

// Configura Multer para guardar archivos en la carpeta 'uploads'
const storage = multer({
    storage: multer.memoryStorage()
  }).single("audio");


export default storage;
