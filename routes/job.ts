import { Router } from 'express';
import { deleteJob, fetchFirstJob, getJob, insertJob, updateJob } from '../controller/job.ts';
import { unifiedUpload } from '../config/multer.ts';


const route = Router();

route.get('/', getJob);
route.get('/:id', fetchFirstJob);
route.post('/', unifiedUpload.single('file'), insertJob);
route.put('/:id', unifiedUpload.single('file'), updateJob);
route.delete('/:id', deleteJob);


export default route;