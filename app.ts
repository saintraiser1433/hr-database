import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { expressLogger, errorLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
const app = express();
const PORT = process.env.APP_PORT || 3000;




app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('public/uploads')); //for static directory

app.use('/api/v1', router)
app.use(expressLogger);
app.use(errorLogger);


app.get('*', (req: Request, res: Response) => {
    res.status(400).json({
        message: 'Route not found'
    });
});

//middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})



