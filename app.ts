import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { expressLogger, errorLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Serve static files from the 'public/uploads' directory under the '/job' route
app.use('/job-images', express.static('public/job-offer-uploads'));

// API routes
app.use('/api/v1', router);

// Logging middleware
app.use(expressLogger);
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

// Catch-all route for 404 errors
app.get('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});