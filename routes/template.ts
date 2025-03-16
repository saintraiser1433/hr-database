import { Router } from 'express';
import { fetchTemplateHeader, insertTemplateHeader, modifyTemplateHeader, deleteTemplateHeader, deleteTemplateDetail, fetchTemplateDetail, insertTemplateDetail, modifyTemplateDetail } from '../controller/template.ts';

const route = Router();

//template
route.get('/', fetchTemplateHeader);
route.post('/', insertTemplateHeader);
route.put('/:id', modifyTemplateHeader);
route.delete('/:id', deleteTemplateHeader);



route.get('/detail/:id', fetchTemplateDetail);
route.post('/detail', insertTemplateDetail);
route.put('/detail/:id', modifyTemplateDetail);
route.delete('/detail/:id', deleteTemplateDetail);


//assigning
// route.get('/assign/:id', fetchAssignTemplate);
// route.post('/assign', insertAssignTemplate);
// route.put('/assign/:id', modifyAssignTemplate);
// route.delete('/assign/:id', deleteAssignTemplate);

export default route;