import { Router } from 'express';
import { deleteDepartment, getDepartment, insertDepartment, updateDepartment } from '../controller/department.ts';

const route = Router();

route.get('/', getDepartment);
route.post('/', insertDepartment);
route.put('/:id', updateDepartment);
route.delete('/:id', deleteDepartment);


export default route;