import { Router } from 'express';
import { fetchApplicantsByFailed, fetchApplicantsByOngoing, fetchApplicantsByPassed, fetchApplicantsByPending, fetchApplicantsByRejected, fetchFailApproveByApplicant, fetchOngoingByApplicant, insertApplicants, modifyFinailizedAppStatus, proceedApplicant, rejectApplicants } from '../controller/applicants';

const route = Router();

route.get('/pending', fetchApplicantsByPending);
route.get('/ongoing', fetchApplicantsByOngoing);
route.get('/rejected', fetchApplicantsByRejected);
route.get('/failed', fetchApplicantsByFailed);
route.get('/passed', fetchApplicantsByPassed);
route.get('/ongoing/:id', fetchOngoingByApplicant);
route.get('/failapprv/:id', fetchFailApproveByApplicant);

route.post('/', insertApplicants);
route.put('/proceed/:id', proceedApplicant);
route.put('/reject/:id', rejectApplicants);
route.put('/finalize/:id', modifyFinailizedAppStatus);

// getOngoingStatusByApplicant


export default route;