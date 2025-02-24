import { Router } from 'express';
import { getRequirements, insertRequirements, updateRequirements, deleteRequirements } from '../controller/requirements';

const route = Router();

route.get('/', getRequirements);
route.post('/', insertRequirements);
route.put('/:id', updateRequirements);
route.delete('/:id', deleteRequirements);


export default route;