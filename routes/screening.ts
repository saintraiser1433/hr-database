import { Router } from 'express';
import { deleteAssignJobScreening, deleteScreening, getAllJobScreening, getScreening, insertAssignJobScreening, insertScreening, updateAssignJobScreening, updateScreening } from '../controller/screening';

const route = Router();

route.get('/', getScreening);
route.post('/', insertScreening);
route.put('/:id', updateScreening);
route.delete('/:id', deleteScreening);


route.get('/assign', getAllJobScreening)
route.post('/assign', insertAssignJobScreening)
route.put('/assign/:jobId/:screeningId', updateAssignJobScreening)
route.delete('/assign/:jobId/:screeningId', deleteAssignJobScreening)

export default route;