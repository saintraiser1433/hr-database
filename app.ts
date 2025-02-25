import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { expressLogger, errorLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
const app = express();
const PORT = process.env.APP_PORT || 3000;



app.use(express.json({ limit: '10mb' }));
app.use(cors())

app.use('/job', express.static('public/job-offer-uploads')); //for static directory

app.use('/api/v1', router)
app.use(expressLogger);
app.use(errorLogger);   
app.use(errorHandler);

app.get('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'Route not found'
    });
});



app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})



