import { Router } from 'express';
import { deleteJob, getJob, insertJob, updateJob } from '../controller/job.ts';
import { upload } from '../config/multer.ts';

const route = Router();

route.get('/', getJob);
route.post('/', upload.single('file'), insertJob);
route.put('/:id',upload.single('file'), updateJob);
route.delete('/:id', deleteJob);


export default route;