import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults, fetchEvaluateQuestion, assigningPeerEvaluations, fetchPeerEvaluation, submissionPeerEvaluation, fetchPeerEvaluateeByEmpId } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
route.get('/viewPeer', fetchPeerEvaluation);
route.get('/peer/:empId', fetchPeerEvaluateeByEmpId);
route.get('/view/:employeeId/:acadId', fetchEvaluateQuestion)
route.get('/criteria/:employeeId/:acadId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.post('/submit', submissionTeamLeadEvaluation);
route.post('/submitPeer', submissionPeerEvaluation);
route.post('/assign', assigningPeerEvaluations);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);
route.get('/result/:acadId/:employeesId', fetchTeamLeadResults);




export default route;