import { Router } from 'express';
import requirementsRoute from './requirements';
import jobRoute from './job';
import screeningRoute from './screening';
import departmentRoute from './department';
import fileRoute from './file';
import evaluationRoute from './evaluation'
import applicantRoute from './applicants'
import interviewRoute from './interview'
const route = Router();

route.use('/requirements', requirementsRoute)
route.use('/evaluation', evaluationRoute)
route.use('/job', jobRoute)
route.use('/file', fileRoute)
route.use('/applicant', applicantRoute)
route.use('/department', departmentRoute)
route.use('/screening', screeningRoute)
route.use('/interview', interviewRoute)




export default route;