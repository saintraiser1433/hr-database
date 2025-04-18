import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import router from './routes/index.ts';
import { expressLogger, errorLogger } from './utils/logger.ts';
import { errorHandler } from './middleware/errorHandler.ts';


const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Serve static files from the 'public/uploads' directory under the '/job' route
app.use('/job-images', express.static('public/job-offer-uploads'));
app.use('/avatar', express.static('public/avatar'));
app.use('/resume', express.static('public/resume'));
app.use('/requirements', express.static('public/requirements'));
app.use('/uploads', express.static('public/uploads'));
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


// const webHooks = async () => {
//     const api = new Client(
//         'KLAVXZ',
//         'johnreynalladecosta',
//         httpFetchClient
//     );

//     const webhook = {
//         url: `https://smart-corgi-amazingly.ngrok-free.app/sms-callback`,
//         event: WebHookEventType.SmsReceived,
//     };

//     api.registerWebhook(webhook)
//         .then(created => console.log('Webhook created:', created.id))
//         .catch(console.error);

//     // List webhooks
//     api.getWebhooks()
//         .then(webhooks => console.log('Active webhooks:', webhooks.length));

// }

// webHooks();

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});