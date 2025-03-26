import express from 'express';
import { unifiedUpload } from '../config/multer.ts';
import { uploadFile } from '../controller/uploadFile.ts';

const router = express.Router();

router.post('/job', unifiedUpload.single('file'), uploadFile);

export default router;
