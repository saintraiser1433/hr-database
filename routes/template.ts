import { Router } from 'express';
import { fetchTemplate, insertTemplate, modifyTemplate, deleteTemplate } from '../controller/template.ts';

const route = Router();

//template
route.get('/', fetchTemplate);
route.post('/', insertTemplate);
route.put('/:id', modifyTemplate);
route.delete('/:id', deleteTemplate);

export default route;