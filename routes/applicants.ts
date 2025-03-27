import { Router } from 'express';
import { fetchApplicantCountByJob, fetchApplicantsByFailed, fetchApplicantsByOngoing, fetchApplicantsByPassed, fetchApplicantsByPending, fetchApplicantsByRejected, fetchApplicantTopJob, fetchFailApproveByApplicant, fetchOngoingByApplicant, insertApplicants, modifyFinailizedAppStatus, proceedApplicant, rejectApplicants } from '../controller/applicants.ts';
import { unifiedUpload } from '../config/multer.ts';

const route = Router();

route.get('/countjob', fetchApplicantCountByJob);
route.get('/topjob', fetchApplicantTopJob);
route.get('/pending', fetchApplicantsByPending);
route.get('/ongoing', fetchApplicantsByOngoing);
route.get('/rejected', fetchApplicantsByRejected);
route.get('/failed', fetchApplicantsByFailed);
route.get('/passed', fetchApplicantsByPassed);
route.get('/ongoing/:id', fetchOngoingByApplicant);
route.get('/failapprv/:id', fetchFailApproveByApplicant);

route.post('/', unifiedUpload.fields([
    { name: 'resume_path', maxCount: 1 },
    { name: 'photo_path', maxCount: 1 },
]), insertApplicants);
route.put('/proceed/:id', proceedApplicant);
route.put('/reject/:id', rejectApplicants);
route.put('/finalize/:id', modifyFinailizedAppStatus);




export default route;