import { Router } from 'express';
import { addApplicantScreening, addJobToScreening, addScreening, fetchJobScreenings, fetchScreenings, filterScreeningTypeByApplicantId, filterScreeningTypeByJobId, modifyJobScreeningSequence, modifyScreening, removeScreening, unassignApplicantScreening, unassignJobFromScreening } from '../controller/screening.ts';


const route = Router();

route.get('/', fetchScreenings);
route.post('/', addScreening);
route.post('/assign', addJobToScreening)
route.post('/applicantAssign', addApplicantScreening)
route.put('/sequence/:id', modifyJobScreeningSequence)
route.put('/:id', modifyScreening);
route.get('/app/:applicantId', filterScreeningTypeByApplicantId)
route.get('/job/:jobId', filterScreeningTypeByJobId)
route.get('/assign/:jobId', fetchJobScreenings)
route.delete('/assign', unassignJobFromScreening)
route.delete('/app/:id', unassignApplicantScreening)
route.delete('/:id', removeScreening);

export default route;