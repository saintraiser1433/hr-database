import { Router } from 'express';
import { fetchAllEmployeesByDeptID, fetchEmployeeInformationById, fetchRequirementByEmpID, insertEmptoRequire, removeEmpToRequire, updateEmpInformation, updateEmpRequireStatus, updateRoleStatus } from '../controller/employee.ts';

const route = Router();

route.get('/:id', fetchAllEmployeesByDeptID);
route.get('/req/:empId', fetchRequirementByEmpID);
route.get('/info/:empId', fetchEmployeeInformationById);
route.put('/status/:id', updateEmpRequireStatus);
route.put('/info/:id', updateEmpInformation);
route.put('/:empId', updateRoleStatus);
route.post('/assign', insertEmptoRequire)
route.post('/assign/delete', removeEmpToRequire)


export default route;