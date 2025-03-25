import express from 'express';
// import { upload } from '../config/multer.ts';
import { uploadFile } from '../controller/uploadFile.ts';

const router = express.Router();

// router.post('/job', upload.single('file'), uploadFile);

export default router;
