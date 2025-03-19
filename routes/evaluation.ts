import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults, fetchEvaluateQuestion, assigningPeerEvaluations, fetchPeerEvaluation, submissionPeerEvaluation, fetchPeerEvaluateeByEmpId, fetchPeerCategoryQuestion } from '../controller/evaluation.ts';
const route = Router();

//evaluation

route.get('/ongoing', fetchEvaluationByOngoing);
//viewing peer after assigning random
route.get('/viewPeer', fetchPeerEvaluation);
//fetch category question by academic year
route.get('/peer/category/:acadId', fetchPeerCategoryQuestion);
//list to evaluate by employee id
route.get('/peer/:empId', fetchPeerEvaluateeByEmpId);
//fetching answers for question
route.get('/view/:employeeId/:acadId', fetchEvaluateQuestion)
//get evaluation criteria with question with assign task criteria combine
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