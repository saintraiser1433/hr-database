import { Router } from 'express';
import { getRequirements, insertRequirements, updateRequirements, deleteRequirements, submitRequirements, checkExpiryRequirements, modifyRequirementAsSent, modifyExpiredRequirements } from '../controller/requirements.ts';
import { unifiedUpload } from '../config/multer.ts';

const route = Router();
route.get('/expiry', checkExpiryRequirements);
route.get('/', getRequirements);
route.post('/', insertRequirements);
route.get('/updateExpiry', modifyExpiredRequirements);
route.put('/mark-sent/:id', modifyRequirementAsSent);
route.put('/submit/:id', unifiedUpload.single('requirements'), submitRequirements)
route.put('/:id', updateRequirements);
route.delete('/:id', deleteRequirements);



export default route;