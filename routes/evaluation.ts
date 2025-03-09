import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation, deleteEvaluationPeerQuestion, fetchEvaluationPeerQuestion, insertEvaluationPeerQuestion, updateEvaluationPeerQuestion, deleteEvaluationPeerCategory, fetchEvaluationPeerCategory, insertEvaluationPeerCategory, updateEvaluationPeerCategory } from '../controller/evaluation.ts';

const route = Router();

//evaluation
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);


//peer category
route.get('/peer/:id', fetchEvaluationPeerCategory);
route.post('/peer', insertEvaluationPeerCategory);
route.put('/peer/:id', updateEvaluationPeerCategory);
route.delete('/peer/:id', deleteEvaluationPeerCategory);

//peer question
route.get('/peer/q/:id', fetchEvaluationPeerQuestion);
route.post('/peer/q', insertEvaluationPeerQuestion);
route.put('/peer/q/:id', updateEvaluationPeerQuestion);
route.delete('/peer/q/:id', deleteEvaluationPeerQuestion);


export default route;