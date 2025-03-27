

import { Router } from 'express';
import { fetchAllSummary } from '../controller/summary.ts';

const route = Router();
route.get('/',fetchAllSummary);

export default route;