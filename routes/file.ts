import express from 'express';
import { upload } from '../config/multer';
import { uploadFile } from '../controller/uploadFile';

const router = express.Router();

router.post('/job', upload.single('file'), uploadFile);

export default router;
