import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults, fetchEvaluateQuestion } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
route.get('/view/:employeeId/:evalId',fetchEvaluateQuestion)
route.get('/criteria/:employeeId/:evalId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.post('/submit', submissionTeamLeadEvaluation);

route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);
route.get('/result/:evaluationId/:employeesId', fetchTeamLeadResults);




export default route;