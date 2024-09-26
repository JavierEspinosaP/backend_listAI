import multer from 'multer';

const storage = multer({
    storage: multer.memoryStorage()
  }).single("audio");


export default storage;
