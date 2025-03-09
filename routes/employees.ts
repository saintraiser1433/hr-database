import { Router } from 'express';
import { assignStatusTeamlead, fetchAllEmployeesByDeptID, fetchEmployeeInformationById, fetchRequirementByEmpID, insertEmptoRequire, removeEmpToRequire, unassignStatusTeamlead, updateEmpInformation, updateEmpRequireStatus } from '../controller/employee.ts';

const route = Router();

route.get('/:id', fetchAllEmployeesByDeptID);
route.get('/req/:empId', fetchRequirementByEmpID);
route.get('/info/:empId', fetchEmployeeInformationById);
route.put('/status/:id', updateEmpRequireStatus);
route.put('/info/:id', updateEmpInformation);
route.put('/assign/:empId', assignStatusTeamlead);
route.put('/unassign/:empId', unassignStatusTeamlead);
route.post('/assign', insertEmptoRequire)
route.post('/assign/delete', removeEmpToRequire)


export default route;