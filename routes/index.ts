import { Router } from 'express';
import requirementsRoute from './requirements';
import jobRoute from './job';
import screeningRoute from './screening';
import departmentRoute from './department';
const route = Router();

route.use('/requirements', requirementsRoute)
route.use('/job', jobRoute)
route.use('/department', departmentRoute)
route.use('/screening', screeningRoute)




export default route;