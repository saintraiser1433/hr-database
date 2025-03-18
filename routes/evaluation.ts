import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults, fetchEvaluateQuestion, assigningPeerEvaluations } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
route.get('/view/:employeeId/:acadId', fetchEvaluateQuestion)
route.get('/criteria/:employeeId/:acadId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.post('/submit', submissionTeamLeadEvaluation);
route.post('/assign', assigningPeerEvaluations);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);
route.get('/result/:acadId/:employeesId', fetchTeamLeadResults);




export default route;