import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
route.get('/criteria/:employeeId/:deptId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);





export default route;