import { Router } from 'express';
import { addJobToScreening, addScreening, fetchJobScreenings, fetchScreenings, filterScreeningTypeByJobId, modifyJobScreeningSequence, modifyScreening, removeScreening, unassignJobFromScreening } from '../controller/screening';


const route = Router();

route.get('/', fetchScreenings);
route.post('/', addScreening);
route.put('/:id', modifyScreening);
route.delete('/:id', removeScreening);
route.get('/f/:jobId',filterScreeningTypeByJobId)
route.get('/assign', fetchJobScreenings)
route.post('/assign', addJobToScreening)
route.post('/assign/delete', unassignJobFromScreening)
route.put('/sequence/:jobId/:screeningId', modifyJobScreeningSequence)


export default route;