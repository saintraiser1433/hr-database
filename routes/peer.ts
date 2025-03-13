import { Router } from 'express';
import { modifyBundleTemplatePeer, modifyTemplatePeer } from '../controller/template.ts';
import { fetchEvaluationPeerCategory, insertEvaluationPeerCategory, updateEvaluationPeerCategory, deleteEvaluationPeerCategory } from '../controller/peer.ts';

const route = Router();

//peer category
route.get('/:id', fetchEvaluationPeerCategory);
route.post('', insertEvaluationPeerCategory);
route.put('/:id', updateEvaluationPeerCategory);
route.delete('/:id', deleteEvaluationPeerCategory);
//assigningtemplate
route.put('/temp/:evaluationId', modifyBundleTemplatePeer);
route.put('/temp/s/:peerId', modifyTemplatePeer);





export default route;