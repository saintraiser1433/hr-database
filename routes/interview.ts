import { Router } from 'express';
import { modifyInterviewDate } from '../controller/interview';

const route = Router();


route.put('/:id', modifyInterviewDate);




export default route;