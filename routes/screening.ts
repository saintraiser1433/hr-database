import { Router } from 'express';
import { deleteScreening, getScreening, insertScreening, updateScreening } from '../controller/screening';

const route = Router();

route.get('/', getScreening);
route.post('/', insertScreening);
route.put('/:id', updateScreening);
route.delete('/:id', deleteScreening);


export default route;