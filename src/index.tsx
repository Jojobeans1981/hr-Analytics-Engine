import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';

// 1. Get the root DOM element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

// 2. Create a root
const root = createRoot(container);


// 4. Render the app
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);