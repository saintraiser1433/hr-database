import { Router } from 'express';
import { deleteJob, getJob, insertJob, updateJob } from '../controller/job';

const route = Router();

route.get('/', getJob);
route.post('/', insertJob);
route.put('/:id', updateJob);
route.delete('/:id', deleteJob);


export default route;