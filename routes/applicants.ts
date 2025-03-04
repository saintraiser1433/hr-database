import { Router } from 'express';
import { fetchApplicantsByOngoing, fetchApplicantsByPending, fetchApplicantsByRejected, fetchOngoingByApplicant, insertApplicants, proceedApplicant, rejectApplicants } from '../controller/applicants';

const route = Router();

route.get('/pending', fetchApplicantsByPending);
route.get('/ongoing', fetchApplicantsByOngoing);
route.get('/rejected', fetchApplicantsByRejected);
route.get('/ongoing/:id', fetchOngoingByApplicant);

route.post('/', insertApplicants);
route.put('/proceed/:id', proceedApplicant);
route.put('/reject/:id', rejectApplicants);

// getOngoingStatusByApplicant


export default route;