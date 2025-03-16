import { Router } from 'express';
import { fetchCriteriaByColleague, insertCriteriaByColleague, updateCriteriaByColleague, deleteCriteriaByColleague, fetchColleagueByDept, fetchEvaluationTeamLeadCategory, insertEvaluationTeamLeadCategory, updateEvaluationTeamLeadCategory, deleteEvaluationTeamLeadCategory, deleteEvaluationTeamLeadCriteria, fetchEvaluationTeamLeadCriteria, insertEvaluationTeamLeadCriteria, updateEvaluationTeamLeadCriteria, fetchFilterCategoryByLead } from '../controller/teamlead.ts';


const route = Router();

//teamlead category
route.get('/:id', fetchEvaluationTeamLeadCategory);
route.post('/', insertEvaluationTeamLeadCategory);
route.put('/:id', updateEvaluationTeamLeadCategory);
route.delete('/:id', deleteEvaluationTeamLeadCategory);


//criteria question


//assigningtemplate

//assigning criteria
route.get('/criteria/:id', fetchEvaluationTeamLeadCriteria);
route.post('/criteria', insertEvaluationTeamLeadCriteria);
route.put('/criteria/:id', updateEvaluationTeamLeadCriteria);
route.delete('/criteria/:id', deleteEvaluationTeamLeadCriteria);

//teamlead module

route.get('/main/:id', fetchFilterCategoryByLead);
route.get('/main/emp/:deptId', fetchColleagueByDept)

//teamlead module criteria
route.get('/main/criteria/:evalId/:employeeId', fetchCriteriaByColleague);
route.post('/main/criteria', insertCriteriaByColleague);
route.put('/main/criteria/:id', updateCriteriaByColleague);
route.delete('/main/criteria/:id', deleteCriteriaByColleague);



export default route;