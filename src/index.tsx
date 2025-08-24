import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define a custom colour palette that echoes the Wiqayah brand.  The dark
// blue primary colour and gold secondary colour are inspired by common
// recommendations for security websites, which advise using blues, greys
// and whites to convey trust and professionalism【981598205358064†L72-L83】.
// The gold accent ties into the company's logo and helps call attention
// to important actions.
const theme = createTheme({
  palette: {
    primary: { main: '#061133' },    // deep navy blue for buttons and highlights
    secondary: { main: '#d4af37' },  // gold accent colour
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Apply our custom theme across the application */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);