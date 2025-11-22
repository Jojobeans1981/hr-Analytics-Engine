export const corsOptions = {
    origin: [
        'https://dashboard-new-eta-blond.vercel.app',
        'https://dashboard-gfjo6f4rg-joseph-panettas-projects.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
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
        'Access-Control-Request-Headers',
        'Cache-Control',
        'Pragma',
        'If-Modified-Since',
        'If-None-Match',
        'User-Agent',
        'Referer'
    ],
    exposedHeaders: [
        'Content-Range',
        'X-Content-Range',
        'Content-Length',
        'ETag'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
};
