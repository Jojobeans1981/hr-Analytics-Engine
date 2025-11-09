import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// 1. Get the root DOM element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

// 2. Create a root
const root = createRoot(container);

// 3. Create theme
const theme = createTheme();

// 4. Render the app
root.render(
  
    <CssBaseline />
    <App />
  
);