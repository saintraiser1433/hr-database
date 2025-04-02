import { Router } from 'express';
import { assignStatusTeamlead, fetchAllEmployeesByDeptID, fetchEmployeeCountByDeptId, fetchEmployeeInformationById, fetchRequirementByEmpID, insertEmptoRequire, modifyEmpImage, removeEmpToRequire, unassignStatusTeamlead, updateCredentials, updateEmpInformation, updateEmpRequireStatus } from '../controller/employee.ts';
import { unifiedUpload } from '../config/multer.ts';

const route = Router();

route.get('/req/:empId', fetchRequirementByEmpID);
route.get('/info/:empId', fetchEmployeeInformationById);
route.get('/dept/:id', fetchAllEmployeesByDeptID);
route.get('/deptCount', fetchEmployeeCountByDeptId);
route.put('/status/:id', updateEmpRequireStatus);
route.put('/credentials/:empId', updateCredentials);
route.put('/info/:id', updateEmpInformation);
route.put('/infoImage/:id',unifiedUpload.single('photo_path'), modifyEmpImage);
route.put('/assign/:empId', assignStatusTeamlead);
route.put('/unassign/:empId', unassignStatusTeamlead);
route.post('/assign', insertEmptoRequire)
route.post('/assign/delete', removeEmpToRequire)



export default route;