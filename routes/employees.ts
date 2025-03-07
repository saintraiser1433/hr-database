import { Router } from 'express';
import { fetchAllEmployeesByDeptID, fetchRequirementByEmpID, insertEmptoRequire, removeEmpToRequire, updateEmpRequireStatus } from '../controller/employee.ts';

const route = Router();

route.get('/:id', fetchAllEmployeesByDeptID);
route.get('/req/:empId', fetchRequirementByEmpID);
route.put('/status/:id', updateEmpRequireStatus);
route.post('/assign', insertEmptoRequire)
route.post('/assign/delete', removeEmpToRequire)
export default route;