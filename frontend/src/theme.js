import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e6fffb',
    100: '#b2f5ea',
    200: '#81e6d9',
    300: '#4fd1c5',
    400: '#38b2ac',
    500: '#2dd4bf',
    600: '#14b8a6',
    700: '#0f766e',
    800: '#115e59',
    900: '#0b3b39',
  },
  accent: {
    500: '#3b82f6',
    600: '#2563eb',
  },
};

const styles = {
  global: {
    body: {
      bg: 'gray.900',
      color: 'gray.100',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: '600',
    },
    variants: {
      solid: {
        bg: 'accent.600',
        color: 'white',
        _hover: { bg: 'accent.500' },
      },
      ghost: {
        _hover: { bg: 'whiteAlpha.200' },
      },
      outline: {
        borderColor: 'whiteAlpha.300',
        color: 'gray.100',
        _hover: { bg: 'whiteAlpha.200' },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'gray.800',
        borderColor: 'whiteAlpha.200',
        borderWidth: '1px',
        shadow: 'xl',
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
});

export default theme;


