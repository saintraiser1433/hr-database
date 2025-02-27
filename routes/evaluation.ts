import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, fetchEvaluationQuestion, deleteEvaluationQuestion, insertEvaluationQuestion, updateEvaluationQuestion } from '../controller/evaluation';

const route = Router();

route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);

route.get('/quest/:id', fetchEvaluationQuestion);
route.post('/quest', insertEvaluationQuestion);
route.put('/quest/:id', updateEvaluationQuestion);
route.delete('/quest/:id', deleteEvaluationQuestion);


export default route;