import { Router } from 'express';
import { fetchApplicants, insertApplicants, rejectApplicants } from '../controller/applicants';

const route = Router();

route.get('/', fetchApplicants);
route.post('/', insertApplicants);
route.delete('/:id', rejectApplicants);



export default route;