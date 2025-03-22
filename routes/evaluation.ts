import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationByOngoing, fetchEvaluationEmployeeCriteria, submissionTeamLeadEvaluation, fetchTeamLeadResults, fetchEvaluateQuestion, assigningPeerEvaluations, fetchPeerEvaluation, submissionPeerEvaluation, fetchPeerEvaluateeByEmpId, fetchPeerCategoryQuestion, fetchPeerResult, fetchEmployeeEvaluateeStatus, fetchPeerEvaluateQuestion } from '../controller/evaluation.ts';
const route = Router();

//evaluation
route.get('/teamResult', fetchTeamLeadResults);
route.get('/peerResult', fetchPeerResult);
route.get('/status', fetchEmployeeEvaluateeStatus);
route.get('/ongoing', fetchEvaluationByOngoing);
// route.get('/peerResultById', fetchPeerResultById);

//viewing peer after assigning random
route.get('/viewPeer', fetchPeerEvaluation);
//fetch category question by academic year
route.get('/peer/category/:acadId', fetchPeerCategoryQuestion);
//list to evaluate by employee id
route.get('/peer/:empId', fetchPeerEvaluateeByEmpId);
//fetching answers teamlead for question
route.get('/view/:employeeId/:acadId', fetchEvaluateQuestion)
//fetch answer peer question
route.get('/viewPeerResult/:peerEvalId', fetchPeerEvaluateQuestion)

//get evaluation criteria with question with assign task criteria combine
route.get('/criteria/:employeeId/:acadId', fetchEvaluationEmployeeCriteria);
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);


route.post('/submit', submissionTeamLeadEvaluation);
route.post('/submitPeer', submissionPeerEvaluation);
route.post('/assign', assigningPeerEvaluations);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);





export default route;