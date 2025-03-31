import { Router } from 'express';
import { addJobToScreening, addScreening, fetchJobScreenings, fetchScreenings, filterScreeningTypeByApplicantId, filterScreeningTypeByJobId, modifyJobScreeningSequence, modifyScreening, removeScreening, unassignJobFromScreening } from '../controller/screening.ts';


const route = Router();

route.get('/', fetchScreenings);
route.post('/', addScreening);
route.post('/assign', addJobToScreening)
route.put('/sequence/:id', modifyJobScreeningSequence)
route.put('/:id', modifyScreening);
route.get('/app/:applicantId', filterScreeningTypeByApplicantId)
route.get('/job/:jobId', filterScreeningTypeByJobId)
route.get('/assign/:jobId', fetchJobScreenings)
route.delete('/assign', unassignJobFromScreening)
route.delete('/:id', removeScreening);

export default route;