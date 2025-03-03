import { Router } from 'express';
import { fetchApplicantsByOngoing, fetchApplicantsByPending, fetchApplicantsByRejected, insertApplicants, rejectApplicants } from '../controller/applicants';

const route = Router();

route.get('/pending', fetchApplicantsByPending);
route.get('/ongoing', fetchApplicantsByOngoing);
route.get('/rejected', fetchApplicantsByRejected);
route.post('/', insertApplicants);
route.put('/:id', rejectApplicants);



export default route;