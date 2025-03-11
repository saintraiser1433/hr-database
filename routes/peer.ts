import { Router } from 'express';
import { modifyBundleTemplatePeer, modifyTemplatePeer } from '../controller/template.ts';
import { fetchEvaluationPeerCategory, insertEvaluationPeerCategory, updateEvaluationPeerCategory, deleteEvaluationPeerCategory, fetchEvaluationPeerQuestion, insertEvaluationPeerQuestion, updateEvaluationPeerQuestion, deleteEvaluationPeerQuestion } from '../controller/peer.ts';

const route = Router();

//peer category
route.get('/:id', fetchEvaluationPeerCategory);
route.post('', insertEvaluationPeerCategory);
route.put('/:id', updateEvaluationPeerCategory);
route.delete('/:id', deleteEvaluationPeerCategory);


//peer question
route.get('/q/:id', fetchEvaluationPeerQuestion);
route.post('/q', insertEvaluationPeerQuestion);
route.put('/q/:id', updateEvaluationPeerQuestion);
route.delete('/q/:id', deleteEvaluationPeerQuestion);

//assigningtemplate
route.put('/temp/:evaluationId', modifyBundleTemplatePeer);
route.put('/temp/s/:peerId', modifyTemplatePeer);





export default route;