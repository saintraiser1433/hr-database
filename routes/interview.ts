import { Router } from 'express';
import { modifyInterviewDate, modifyInterviewUpdate } from '../controller/interview.ts';

const route = Router();


route.put('/date/:id', modifyInterviewDate);
route.put('/status/:id', modifyInterviewUpdate)



export default route;