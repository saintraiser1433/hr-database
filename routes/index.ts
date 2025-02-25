import { Router } from 'express';
import requirementsRoute from './requirements';
import jobRoute from './job';
import screeningRoute from './screening';
import departmentRoute from './department';
import fileRoute from './file';
const route = Router();

route.use('/requirements', requirementsRoute)
route.use('/job', jobRoute)
route.use('/file', fileRoute)
route.use('/department', departmentRoute)
route.use('/screening', screeningRoute)




export default route;