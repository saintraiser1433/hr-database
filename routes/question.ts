import { Router } from 'express';
import { fetchCriteriaQuestion, insertCriteriaQuestion, updateCriteriaQuestion, deleteCriteriaQuestion, fetchEvaluationPeerQuestion, fetchCustomCriteriaQuestion } from '../controller/question.ts';
const route = Router();

route.get('/:id', fetchCriteriaQuestion);
route.get('/peer/:id', fetchEvaluationPeerQuestion);
route.get('/custom/:id', fetchCustomCriteriaQuestion);
route.post('/', insertCriteriaQuestion);
route.put('/:id', updateCriteriaQuestion);
route.delete('/:id', deleteCriteriaQuestion);



export default route;