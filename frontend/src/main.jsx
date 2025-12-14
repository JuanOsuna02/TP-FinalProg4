import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import theme from './theme';

// Punto de entrada: Chakra + theme + toasts + app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            marginTop: '12px',
          },
        }}
      />
      <App />
    </ChakraProvider>
  </StrictMode>,
);
