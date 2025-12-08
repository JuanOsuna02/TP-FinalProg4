import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { createRoutine, getRoutine, updateRoutine } from '../api/routines';
import toast from 'react-hot-toast';

const dayOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const emptyExercise = () => ({
  id: undefined,
  name: '',
  day: 'Lunes',
  series: 3,
  repetitions: 10,
  weight: '',
  notes: '',
  order: 0,
});

const RoutineForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    exercises: [emptyExercise()],
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getRoutine(id);
        setForm({
          name: data.name,
          description: data.description ?? '',
          exercises: data.exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            day: ex.day,
            series: ex.series,
            repetitions: ex.repetitions,
            weight: ex.weight ?? '',
            notes: ex.notes ?? '',
            order: ex.order ?? 0,
          })),
        });
      } catch (err) {
        setError('No se pudo cargar la rutina');
        toast.error('No se pudo cargar la rutina');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateExercise = (index, field, value) => {
    setForm((prev) => {
      const exercises = [...prev.exercises];
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...prev, exercises };
    });
  };

  const addExercise = () => {
    setForm((prev) => ({ ...prev, exercises: [...prev.exercises, emptyExercise()] }));
  };

  const removeExercise = (index) => {
    setForm((prev) => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    for (const ex of form.exercises) {
      if (!ex.name.trim()) {
        setError('Todos los ejercicios deben tener nombre');
        return false;
      }
      if (!ex.series || ex.series <= 0 || !ex.repetitions || ex.repetitions <= 0) {
        setError('Series y repeticiones deben ser mayores a 0');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      exercises: form.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        day: ex.day,
        series: Number(ex.series),
        repetitions: Number(ex.repetitions),
        weight: ex.weight === '' ? null : Number(ex.weight),
        notes: ex.notes || null,
        order: Number(ex.order ?? 0),
      })),
    };
    try {
      const data = isEdit ? await updateRoutine(id, payload) : await createRoutine(payload);
      toast.success(isEdit ? 'Rutina actualizada' : 'Rutina creada');
      navigate(`/rutinas/${data.id}`);
    } catch (err) {
      setError('No se pudo guardar la rutina');
      toast.error('No se pudo guardar la rutina');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Text>Cargando...</Text>;

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <Heading size="md">{isEdit ? 'Editar rutina' : 'Nueva rutina'}</Heading>
        <Text color="gray.400">Completa los datos de la rutina y sus ejercicios.</Text>
      </CardHeader>

      <CardBody>
        {error && (
          <Box bg="red.500" color="white" p={3} borderRadius="md" mb={3}>
            {error}
          </Box>
        )}

        <Stack as="form" spacing={4} onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Opcional"
            />
          </FormControl>

          <Flex align="center" justify="space-between">
            <Heading size="sm">Ejercicios</Heading>
            <Button variant="outline" leftIcon={<FiPlus />} onClick={addExercise}>
              Agregar ejercicio
            </Button>
          </Flex>

          <Stack spacing={3}>
            {form.exercises.map((ex, index) => (
              <Box key={index} borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="md" p={3}>
                <Flex align="center" justify="space-between" mb={2}>
                  <Text fontWeight="semibold">Ejercicio #{index + 1}</Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FiTrash2 />}
                    onClick={() => removeExercise(index)}
                  >
                    Quitar
                  </Button>
                </Flex>

                <Grid templateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={3}>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        value={ex.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Día</FormLabel>
                      <Select
                        value={ex.day}
                        onChange={(e) => updateExercise(index, 'day', e.target.value)}
                      >
                        {dayOptions.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={3} mt={2}>
                  <FormControl isRequired>
                    <FormLabel>Series</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={ex.series}
                      onChange={(e) => updateExercise(index, 'series', e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Repeticiones</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={ex.repetitions}
                      onChange={(e) => updateExercise(index, 'repetitions', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Peso (kg)</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={ex.weight}
                      onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3} mt={2}>
                  <FormControl>
                    <FormLabel>Orden</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      value={ex.order}
                      onChange={(e) => updateExercise(index, 'order', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Notas</FormLabel>
                    <Input
                      value={ex.notes}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      placeholder="Opcional"
                    />
                  </FormControl>
                </Grid>
              </Box>
            ))}
          </Stack>

          <Divider />

          <HStack justify="flex-end" spacing={3}>
            <Button variant="outline" leftIcon={<FiArrowLeft />} onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="blue" leftIcon={<FiSave />} isLoading={saving}>
              {isEdit ? 'Guardar cambios' : 'Crear rutina'}
            </Button>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RoutineForm;

