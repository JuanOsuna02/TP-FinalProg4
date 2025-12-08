import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  IconButton,
  Link as ChakraLink,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, NavLink } from 'react-router-dom';
import { FiMoon, FiPlus, FiSun } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const bgGradient = useColorModeValue(
    'radial(circle at 20% 20%, rgba(59,130,246,0.08), transparent 28%), radial(circle at 80% 0%, rgba(45,212,191,0.10), transparent 22%), radial(circle at 70% 70%, rgba(59,130,246,0.06), transparent 25%), radial(circle at 10% 90%, rgba(45,212,191,0.05), transparent 22%), #f7fafc',
    'radial(circle at 20% 20%, rgba(45,212,191,0.12), transparent 25%), radial(circle at 80% 0%, rgba(59,130,246,0.10), transparent 22%), radial(circle at 70% 70%, rgba(45,212,191,0.08), transparent 25%), radial(circle at 10% 90%, rgba(59,130,246,0.06), transparent 22%), #0f172a'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const logoSrc = colorMode === 'dark' ? '/logo.png' : '/logo-light.png';
  const logoFallback = colorMode === 'dark' ? '/logo.png' : '/logo.png';

  return (
    <Box
      minH="100vh"
      bg={bg}
      color={textColor}
      bgGradient={bgGradient}
    >
      <Container maxW="100%" px={{ base: 4, md: 10, lg: 16 }} py={4}>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          mb={4}
          bg={cardBg}
          p={3}
          borderRadius="lg"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={border}
        >
          <HStack spacing={3}>
            <Image
              src={logoSrc}
              alt="Gestor Ritmo Gym"
              boxSize="64px"
              borderRadius="md"
              objectFit="cover"
              fallbackSrc={logoFallback}
            />
            <ChakraLink as={Link} to="/" fontWeight="bold" fontSize="lg">
              Gestor Ritmo GYM
            </ChakraLink>
          </HStack>
          <HStack spacing={2}>
            <ChakraLink as={NavLink} to="/" fontWeight="600">
              Inicio
            </ChakraLink>
            <Button
              as={NavLink}
              to="/rutinas/nueva"
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="sm"
            >
              Nueva rutina
            </Button>
            <IconButton
              aria-label="Cambiar tema"
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              onClick={toggleColorMode}
              variant="ghost"
              borderWidth="1px"
            />
          </HStack>
        </Flex>

        <Box as="main">{children}</Box>
      </Container>
    </Box>
  );
};

export default Layout;


