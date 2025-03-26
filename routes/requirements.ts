import { Router } from 'express';
import { getRequirements, insertRequirements, updateRequirements, deleteRequirements, submitRequirements } from '../controller/requirements.ts';
import { unifiedUpload } from '../config/multer.ts';

const route = Router();

route.get('/', getRequirements);
route.post('/', insertRequirements);
route.put('/submit/:id',unifiedUpload.single('requirements'),submitRequirements)
route.put('/:id', updateRequirements);
route.delete('/:id', deleteRequirements);



export default route;