import { Router } from 'express';
import { fetchAllEmployeesByDeptID, fetchRequirementByEmpID } from '../controller/employee.ts';

const route = Router();

route.get('/:id', fetchAllEmployeesByDeptID);
route.get('/req/:empId', fetchRequirementByEmpID);

export default route;