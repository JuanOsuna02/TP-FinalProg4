import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiTrash2, FiEye, FiEdit2, FiInbox, FiCalendar, FiMoreVertical, FiCopy } from 'react-icons/fi';
import { deleteRoutine, duplicateRoutine, exportRoutines, getStats, listRoutines } from '../api/routines';
import toast from 'react-hot-toast';

const dayOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const RoutineList = () => {
  // Estado de datos, filtros y paginación
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [day, setDay] = useState('');
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const size = 6; // máximo por página
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const inputBg = useColorModeValue('gray.50', 'gray.900');
  const inputBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
  const inputColor = useColorModeValue('gray.800', 'gray.100');
  const helperColor = useColorModeValue('gray.500', 'gray.400');
  const exportColor = useColorModeValue('gray.800', 'white');
  const exportBorder = useColorModeValue('gray.300', 'whiteAlpha.500');

  // Carga de rutinas con filtros y paginación
  const fetchRoutines = async (opts = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size };
      if (opts.search) params.nombre = opts.search;
      if (opts.day) params.dia = opts.day;
      const data = await listRoutines(params);
      setRoutines(data.items || []);
      setTotal(data.total || 0);
      if (data.page) setPage(data.page);
    } catch (err) {
      setError('No se pudieron cargar las rutinas');
    } finally {
      setLoading(false);
    }
  };

  // Carga de estadísticas (no bloquea UI si falla)
  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      // ignoramos el error de stats para no frenar el flujo principal
    }
  };

  // Maneja búsqueda por nombre
  const handleSearch = async (value) => {
    setSearch(value);
    setPage(1);
    fetchRoutines({ search: value, day, page: 1 });
  };

  // Maneja filtro por día
  const handleDayChange = (value) => {
    setDay(value);
    setPage(1);
    fetchRoutines({ search, day: value, page: 1 });
  };

  // Borrado de rutina con confirmación
  const handleDelete = async (id) => {
    const ok = window.confirm('¿Eliminar esta rutina y sus ejercicios?');
    if (!ok) return;
    try {
      await deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
      toast.success('Rutina eliminada');
    } catch (err) {
      setError('No se pudo eliminar la rutina');
      toast.error('No se pudo eliminar la rutina');
    }
  };

  // Al cambiar de página recarga lista y stats
  useEffect(() => {
    fetchRoutines({ search, day, page });
    fetchStats();
  }, [page]);

  // Duplica rutina y refresca stats
  const handleDuplicate = async (id) => {
    try {
      const newRoutine = await duplicateRoutine(id);
      toast.success('Rutina duplicada');
      setRoutines((prev) => [newRoutine, ...prev]);
      fetchStats();
    } catch (err) {
      toast.error('No se pudo duplicar');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / size));

  // Exporta CSV/PDF descargando blob
  const handleExport = async (format) => {
    try {
      const blob = await exportRoutines(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rutinas.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Exportado en ${format.toUpperCase()}`);
    } catch (err) {
      toast.error('No se pudo exportar');
    }
  };

  return (
    <Stack spacing={4}>
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Rutinas
          </Text>
          <Text color="gray.400">Crea, busca y administra tus rutinas.</Text>
        </Box>
        <HStack spacing={3}>
          {stats && (
            <Badge colorScheme="orange" px={3} py={2} borderRadius="md">
              Totales: {stats.total_routines} rutinas / {stats.total_exercises} ejercicios
            </Badge>
          )}
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => navigate('/rutinas/nueva')}>
            Nueva rutina
          </Button>
        </HStack>
      </Flex>

      {/* Filtros y export */}
      <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
        <CardBody>
          <Stack spacing={2}>
            <Text fontWeight="600">Búsqueda por nombre</Text>
            <Input
              placeholder="Ej: pecho, tirón, fullbody..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              bg={inputBg}
              color={inputColor}
              borderColor={inputBorder}
            />
            <HStack color={helperColor} spacing={1} fontSize="sm">
              <Icon as={FiSearch} />
              <Text>Escribe para filtrar por nombre</Text>
            </HStack>
            <Box>
              <Text fontWeight="600" mb={1}>
                Día
              </Text>
              <Select
                placeholder="Todos"
                value={day}
                onChange={(e) => handleDayChange(e.target.value)}
                bg={inputBg}
                color={inputColor}
                borderColor={inputBorder}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Box>
            <HStack spacing={3}>
              <Button
                variant="outline"
                color={exportColor}
                borderColor={exportBorder}
                onClick={() => handleExport('csv')}
              >
                Exportar CSV
              </Button>
              <Button
                variant="outline"
                color={exportColor}
                borderColor={exportBorder}
                onClick={() => handleExport('pdf')}
              >
                Exportar PDF
              </Button>
            </HStack>
          </Stack>
        </CardBody>
      </Card>

      {/* Estadísticas resumidas */}
      {stats && (
        <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
          <CardBody>
            <Stack spacing={2}>
              <Text fontWeight="600">Estadísticas</Text>
              <HStack spacing={4} wrap="wrap">
                <Badge colorScheme="orange" px={3} py={2} borderRadius="md">
                  Rutinas: {stats.total_routines}
                </Badge>
                <Badge colorScheme="orange" px={3} py={2} borderRadius="md">
                  Ejercicios: {stats.total_exercises}
                </Badge>
                <Badge colorScheme="orange" px={3} py={2} borderRadius="md">
                  Prom. ejercicios/rutina: {stats.avg_exercises_per_routine.toFixed(1)}
                </Badge>
              </HStack>
              {stats.top_routines_by_exercises?.length > 0 && (
                <Box>
                  <Text fontWeight="600" mb={1}>
                    Top rutinas (por cantidad de ejercicios)
                  </Text>
                  <Stack spacing={1}>
                    {stats.top_routines_by_exercises.map((r) => (
                      <HStack key={r.id} spacing={2}>
                        <Badge colorScheme="teal">{r.exercise_count}</Badge>
                        <Text>{r.name}</Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              )}
              {stats.exercises_per_day && (
                <Box>
                  <Text fontWeight="600" mb={1}>
                    Ejercicios por día
                  </Text>
                  <HStack spacing={3} wrap="wrap">
                    {Object.entries(stats.exercises_per_day).map(([day, count]) => (
                      <Badge key={day} colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="md">
                        {day}: {count}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}
            </Stack>
          </CardBody>
        </Card>
      )}

      {/* Loading / error / vacío */}
      {loading && (
        <Stack>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </Stack>
      )}
      {error && (
        <Card bg={useColorModeValue('blue.50', 'gray.700')} borderWidth="1px" borderColor={cardBorder}>
          <CardBody>
            <Text color={useColorModeValue('gray.700', 'gray.100')}>
              No se pudieron cargar las rutinas. Probá recargar o crear una nueva para empezar.
            </Text>
            <Button mt={3} onClick={() => fetchRoutines({ search, day, page })} size="sm" colorScheme="blue">
              Reintentar
            </Button>
          </CardBody>
        </Card>
      )}
      {!loading && !error && routines.length === 0 && (
        <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
          <CardBody>
            <Stack spacing={3} align="flex-start">
              <HStack spacing={3}>
                <Flex
                  w="40px"
                  h="40px"
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="blue.600"
                  color="white"
                  boxShadow="md"
                >
                  <FiInbox />
                </Flex>
                <Box>
                  <Text fontWeight="bold">Aún no hay rutinas</Text>
                  <Text color="gray.400">Crea la primera y comienza a organizarlas.</Text>
                </Box>
              </HStack>
              <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => navigate('/rutinas/nueva')}>
                Crear rutina
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}

      {/* Grid de rutinas */}
      <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
        {routines.map((routine) => {
          const dateStr = routine.created_at
            ? new Date(routine.created_at).toLocaleDateString()
            : '';
          const exercisesCount = routine.exercises?.length ?? 0;
          return (
            <Card
              key={routine.id}
              as={motion.div}
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ duration: 0.15 }}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
            >
              <Box bg={useColorModeValue('orange.50', 'gray.800')} p={4} borderBottom="1px solid" borderColor={cardBorder}>
                <HStack justify="space-between" mb={3}>
                  <HStack color="orange.400" spacing={2}>
                    <Icon as={FiCalendar} />
                    <Text fontWeight="600" color={useColorModeValue('gray.700', 'gray.100')}>
                      Creada el {dateStr}
                    </Text>
                  </HStack>
                  <Icon as={FiMoreVertical} color={useColorModeValue('gray.500', 'gray.400')} />
                </HStack>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {routine.name}
                </Text>
                <Text color={useColorModeValue('gray.700', 'gray.200')} noOfLines={2}>
                  {routine.description || 'Sin descripción'}
                </Text>
              </Box>

              <Box p={4}>
                <HStack spacing={3} mb={2}>
                  <Badge colorScheme="teal">{exercisesCount} ejercicios</Badge>
                  <Badge colorScheme="orange">ID: {routine.id}</Badge>
                </HStack>
                <Divider mb={3} />
                <HStack spacing={2} flexWrap="wrap">
                  <Button as={Link} to={`/rutinas/${routine.id}`} variant="ghost" leftIcon={<FiEye />}>
                    Ver
                  </Button>
                  <Button
                    as={Link}
                    to={`/rutinas/${routine.id}/editar`}
                    variant="outline"
                    leftIcon={<FiEdit2 />}
                    color={useColorModeValue('gray.800', undefined)}
                    borderColor={useColorModeValue('blackAlpha.300', undefined)}
                  >
                    Editar
                  </Button>
                <Button
                  variant="outline"
                  leftIcon={<FiCopy />}
                  onClick={() => handleDuplicate(routine.id)}
                  color={useColorModeValue('gray.800', undefined)}
                  borderColor={useColorModeValue('blackAlpha.300', undefined)}
                >
                  Duplicar
                </Button>
                  <Button
                    colorScheme="red"
                    variant="solid"
                    leftIcon={<FiTrash2 />}
                    onClick={() => handleDelete(routine.id)}
                  >
                    Eliminar
                  </Button>
                </HStack>
              </Box>
            </Card>
          );
        })}
        {!loading && !error && routines.length === 0 && (
          <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder}>
            <CardBody>
              <Text color={helperColor}>Crea tus rutinas para verlas acá.</Text>
            </CardBody>
          </Card>
        )}
      </SimpleGrid>

      {/* Paginación */}
      <HStack justify="flex-end" spacing={3}>
        <Text color={helperColor}>
          Página {page} / {totalPages} (total {total})
        </Text>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          isDisabled={page <= 1}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          isDisabled={page >= totalPages}
        >
          Siguiente
        </Button>
      </HStack>
    </Stack>
  );
};

export default RoutineList;

