import { Router } from 'express';
import { signOut, refreshToken, signIn } from '../controller/auth.ts';


const route = Router();

route.put('/signout/:id', signOut)
route.get('/refresh', refreshToken)
route.post('/signin', signIn);

export default route;
