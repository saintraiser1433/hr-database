import { Router } from 'express';
import requirementsRoute from './requirements.ts';
import jobRoute from './job.ts';
import screeningRoute from './screening.ts';
import departmentRoute from './department.ts';
import fileRoute from './file.ts';
import evaluationRoute from './evaluation.ts'
import applicantRoute from './applicants.ts'
import interviewRoute from './interview.ts'
import employeesRoute from './employees.ts'
import templateRoute from './template.ts'
import peerRoute from './peer.ts'
import teamleadRoute from './teamlead.ts'
const route = Router();

route.use('/requirements', requirementsRoute)
route.use('/evaluation', evaluationRoute)
route.use('/job', jobRoute)
route.use('/file', fileRoute)
route.use('/applicant', applicantRoute)
route.use('/department', departmentRoute)
route.use('/screening', screeningRoute)
route.use('/interview', interviewRoute)
route.use('/employees', employeesRoute)
route.use('/template', templateRoute)
route.use('/peer', peerRoute)
route.use('/teamlead', teamleadRoute)

export default route;