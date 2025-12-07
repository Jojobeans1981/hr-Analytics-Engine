
// Update CORS configuration (replace or add to existing CORS setup)
const allowedOrigins = [
  'https://dashboard-new-eta-blond.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://prometheus-talent-engine-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',  // ADD THIS
    'Accept',
    'Origin', 
    'X-Requested-With',
    'X-CSRF-Token'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
