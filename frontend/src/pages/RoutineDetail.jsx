import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import { deleteRoutine, getRoutine } from '../api/routines';
import toast from 'react-hot-toast';

const dayOrder = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Estado de rutina y carga
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRoutine = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRoutine(id);
      setRoutine(data);
    } catch (err) {
      setError('No se pudo cargar la rutina');
      toast.error('No se pudo cargar la rutina');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trae detalle de la rutina al montar o cambiar id
    loadRoutine();
  }, [id]);

  const calendar = useMemo(() => {
    // Arma calendario de 7 días agrupando y ordenando ejercicios
    if (!routine?.exercises) {
      return dayOrder.map((day) => ({ day, items: [] }));
    }
    return dayOrder.map((day) => ({
      day,
      items: routine.exercises
        .filter((ex) => ex.day === day)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }));
  }, [routine]);

  const handleDelete = async () => {
    // Confirma y elimina la rutina actual
    const ok = window.confirm('¿Eliminar esta rutina y sus ejercicios?');
    if (!ok) return;
    try {
      await deleteRoutine(id);
      toast.success('Rutina eliminada');
      navigate('/');
    } catch (err) {
      setError('No se pudo eliminar la rutina');
      toast.error('No se pudo eliminar la rutina');
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedText = useColorModeValue('gray.600', 'gray.400');

  if (loading)
    return (
      <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
        <CardBody>
          <Text color={mutedText}>Cargando rutina...</Text>
        </CardBody>
      </Card>
    );

  if (error)
    return (
      <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
        <CardBody>
          <Stack spacing={3}>
            <Text color={mutedText}>{error}. Probá recargar o editarla.</Text>
            <Button size="sm" colorScheme="blue" onClick={loadRoutine}>
              Reintentar
            </Button>
          </Stack>
        </CardBody>
      </Card>
    );

  if (!routine)
    return (
      <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
        <CardBody>
          <Text color={mutedText}>Rutina no encontrada.</Text>
        </CardBody>
      </Card>
    );

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      bg={cardBg}
      borderWidth="1px"
      borderColor={cardBorder}
    >
      <CardHeader>
        <Flex align="center" justify="space-between" gap={4}>
          <Box>
            <Heading size="md" color={textColor}>
              {routine.name}
            </Heading>
            <Text color={mutedText}>{routine.description || 'Sin descripción'}</Text>
          </Box>
          <Flex gap={2}>
            {/* Acciones principales */}
            <Button as={Link} to={`/rutinas/${id}/editar`} variant="outline" leftIcon={<FiEdit2 />}>
              Editar
            </Button>
            <Button colorScheme="red" leftIcon={<FiTrash2 />} onClick={handleDelete}>
              Eliminar
            </Button>
          </Flex>
        </Flex>
        <Flex align="center" gap={2} color={mutedText} mt={2}>
          <Icon as={FiCalendar} />
          <Text>Creada: {new Date(routine.created_at).toLocaleString()}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text fontWeight="bold" mb={3}>
          Calendario semanal
        </Text>
        {calendar.every((c) => c.items.length === 0) && (
          <Text color={mutedText} mb={3}>
            No hay ejercicios cargados. Usa el editor para agregar rutinas por día.
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
          {calendar.map((group) => (
            <Box
              key={group.day}
              borderWidth="1px"
              borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
              bg={useColorModeValue('gray.50', 'gray.800')}
              borderRadius="md"
              p={3}
              minH="140px"
              cursor="pointer"
              onClick={() => navigate(`/rutinas/${id}/editar`)}
              _hover={{ borderColor: useColorModeValue('teal.400', 'teal.200') }}
            >
              <Flex align="center" gap={2} mb={2}>
                <Heading size="sm" color={useColorModeValue('gray.800', 'gray.100')}>
                  {group.day}
                </Heading>
                <Badge colorScheme="teal">{group.items.length}</Badge>
              </Flex>
              <Stack spacing={2}>
                {group.items.length === 0 && (
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Sin rutinas</Text>
                )}
                {group.items.map((ex) => (
                  <Box
                    key={ex.id}
                    borderWidth="1px"
                    borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderRadius="md"
                    p={2}
                  >
                    <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue('gray.800', 'gray.100')}>
                      {ex.name}
                    </Text>
                    <Text color={useColorModeValue('gray.700', 'gray.300')} fontSize="xs">
                      {ex.series} x {ex.repetitions}
                      {ex.weight ? ` | 🏋️ ${ex.weight} kg` : ''} {ex.notes ? `| ${ex.notes}` : ''}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default RoutineDetail;

