import express from 'express';
import cors from 'cors';
import { corsOptions } from './middleware/security.middleware.js';

const app = express();

// Use ONLY the security middleware CORS configuration
app.use(cors(corsOptions));

// Add the rest of your application setup here...
// Make sure there are NO other CORS configurations in this file

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
