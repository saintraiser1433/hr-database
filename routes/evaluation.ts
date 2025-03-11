import { Router } from 'express';
import { fetchEvaluation, insertEvaluation, updateEvaluation, deleteEvaluation } from '../controller/evaluation.ts';
const route = Router();

//evaluation
route.get('/', fetchEvaluation);
route.post('/', insertEvaluation);
route.put('/:id', updateEvaluation);
route.delete('/:id', deleteEvaluation);





export default route;