import express from 'express';
import multer from 'multer';
import uploadAudio from '../utils/multerConfig';
import { processAudio } from '../controllers/audioController';

const router = express.Router();

// Ruta POST para enviar el audio
router.post('/upload-audio', uploadAudio, processAudio);

export default router;
