export const corsOptions = {
    origin: [
        'https://dashboard-f1nm2ss84-joseph-panettas-projects.vercel.app',
        'https://prometheus-talent-engine.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
        process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};
