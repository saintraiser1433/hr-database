import { Router } from 'express';
import { fetchEvaluationTeamLeadCategory, insertEvaluationTeamLeadCategory, updateEvaluationTeamLeadCategory, deleteEvaluationTeamLeadCategory, deleteEvaluationTeamLeadCriteria, fetchEvaluationTeamLeadCriteria, insertEvaluationTeamLeadCriteria, updateEvaluationTeamLeadCriteria, deleteCriteriaQuestion, fetchCriteriaQuestion, insertCriteriaQuestion, updateCriteriaQuestion } from '../controller/teamlead.ts';
import { modifyBundleTemplateTeamLead, modifyTemplateTeamLead } from '../controller/template.ts';

const route = Router();

//teamlead category
route.get('/:id', fetchEvaluationTeamLeadCategory);
route.post('/', insertEvaluationTeamLeadCategory);
route.put('/:id', updateEvaluationTeamLeadCategory);
route.delete('/:id', deleteEvaluationTeamLeadCategory);


//criteria question
route.get('/q/:id', fetchCriteriaQuestion);
route.post('/q', insertCriteriaQuestion);
route.put('/q/:id', updateCriteriaQuestion);
route.delete('/q/:id', deleteCriteriaQuestion);

//assigningtemplate
route.put('/temp/:evaluationId', modifyBundleTemplateTeamLead);
route.put('/temp/s/:id', modifyTemplateTeamLead);

//assigning criteria
route.get('/criteria/:id', fetchEvaluationTeamLeadCriteria);
route.post('/criteria', insertEvaluationTeamLeadCriteria);
route.put('/criteria/:id', updateEvaluationTeamLeadCriteria);
route.delete('/criteria/:id', deleteEvaluationTeamLeadCriteria);





export default route;