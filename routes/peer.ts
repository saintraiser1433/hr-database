import { Router } from 'express';
import { fetchEvaluationPeerCategory, insertEvaluationPeerCategory, updateEvaluationPeerCategory, deleteEvaluationPeerCategory } from '../controller/peer.ts';

const route = Router();

//peer category
route.get('/:id', fetchEvaluationPeerCategory);
route.post('', insertEvaluationPeerCategory);
route.put('/:id', updateEvaluationPeerCategory);
route.delete('/:id', deleteEvaluationPeerCategory);
//assigningtemplate






export default route;