import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
route.get('/criteria/:employeeId/:deptId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.post('/submit', submissionTeamLeadEvaluation);

route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);
route.get('/test/:id', fetchTeamLeadResults);




export default route;