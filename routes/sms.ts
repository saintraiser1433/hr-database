import { Router } from 'express';
import { fetchSMSConfig, addMessage, updateSMSConfig } from '../controller/sms.ts';

const route = Router();

route.get('/', fetchSMSConfig);
route.post('/send', addMessage)
route.post('/', updateSMSConfig);



export default route;