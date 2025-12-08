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
  Stack,
  Text,
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
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
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
    load();
  }, [id]);

  const grouped = useMemo(() => {
    if (!routine?.exercises) return [];
    return dayOrder
      .map((day) => ({
        day,
        items: routine.exercises
          .filter((ex) => ex.day === day)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      }))
      .filter((group) => group.items.length > 0);
  }, [routine]);

  const handleDelete = async () => {
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

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text color="red.300">{error}</Text>;
  if (!routine) return <Text>No encontrada.</Text>;

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <Flex align="center" justify="space-between" gap={4}>
          <Box>
            <Heading size="md">{routine.name}</Heading>
            <Text color="gray.400">{routine.description || 'Sin descripción'}</Text>
          </Box>
          <Flex gap={2}>
            <Button as={Link} to={`/rutinas/${id}/editar`} variant="outline" leftIcon={<FiEdit2 />}>
              Editar
            </Button>
            <Button colorScheme="red" leftIcon={<FiTrash2 />} onClick={handleDelete}>
              Eliminar
            </Button>
          </Flex>
        </Flex>
        <Flex align="center" gap={2} color="gray.400" mt={2}>
          <Icon as={FiCalendar} />
          <Text>Creada: {new Date(routine.created_at).toLocaleString()}</Text>
        </Flex>
      </CardHeader>
      <CardBody>
        {grouped.length === 0 && <Text>No hay ejercicios cargados.</Text>}

        <Stack spacing={4}>
          {grouped.map((group) => (
            <Box key={group.day}>
              <Flex align="center" gap={2} mb={2}>
                <Heading size="sm">{group.day}</Heading>
                <Badge colorScheme="teal">{group.items.length}</Badge>
              </Flex>
              <Stack spacing={2}>
                {group.items.map((ex) => (
                  <Box
                    key={ex.id}
                    p={3}
                    borderWidth="1px"
                    borderColor="whiteAlpha.200"
                    borderRadius="md"
                  >
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text fontWeight="semibold">{ex.name}</Text>
                        <Text color="gray.400" fontSize="sm">
                          {ex.series} x {ex.repetitions} {ex.weight ? `| ${ex.weight} kg` : ''}{' '}
                          {ex.notes ? `| ${ex.notes}` : ''}
                        </Text>
                      </Box>
                      <Text color="gray.400" fontSize="sm">
                        Orden: {ex.order ?? 0}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Stack>
              <Divider mt={3} />
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RoutineDetail;

