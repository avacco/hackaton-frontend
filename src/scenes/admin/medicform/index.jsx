import { Alert, Box, Button, ButtonGroup, Card, Checkbox, CircularProgress, Container, FormControlLabel, Grid2, InputAdornment, Snackbar, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import DragAndDrop from "./components/DragAndDrop";
import { useLocation } from "react-router-dom";
import WorkDaySetter from "./components/WorkDaySetter";
import { AttachMoneyOutlined } from "@mui/icons-material";

export default function Form() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const route = import.meta.env.VITE_API_ROUTE;
  const { token } = useAuth();
 
  // Valores iniciales para campos de formulario
  const [initialValues, setInitialValues] = useState({
    id_persona: "",
    nombre: "",
    apellido: "",
    dni: "",
    fechaNac: "",
    email: "",
    telefono: "",
    direccion: "",
    sueldo: "",
    especialidadMedica: "",
  });

  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  // Define la logica de validacion para los campos
  const userSchema = yup.object().shape({
    nombre: yup.string().required("Requerido"),
    apellido: yup.string().required("Requerido"),
    dni: yup.string().required("Requerido"),
    fechaNac: yup.date().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    telefono: yup.string().required("Requerido"),
    direccion: yup.string().required("Requerido"),
    sueldo: yup.number("").required("Debe ser un valor numerico"),
    especialidadMedica: yup.string().required("Requerido"),
  })

  // Pasos del formulario. Ocultan una parte de este segun su paso.
  const [step, setStep] = useState(1)

  // Para guardar la semana laboral
  const [workweek, setWorkweek] = useState([])

  const [servicesSelected, setServicesSelected] = useState([])
  const [loading, setLoading] = useState(false)

  // Para activar o desactivar el boton de creación de medico.
  const [lastStep, setlastStep] = useState(false)

  
  // Presionar en editar en la tabla de medicos redirige aqui y trae consigo el ID del medico a editar.
  // Si existe un ID, se carga la informacion del medico en el formulario.
  const { state } = useLocation();

  useEffect(() => {
    if(state) {

      axios
        .get(`${route}/medico/traer/${state}`,{
           headers: { Authorization: "Bearer "+token }
          },)
        .then(response => {
          setInitialValues({
            id_persona: response.data.id_persona,
            nombre: response.data.nombre,
            apellido: response.data.apellido,
            dni: response.data.dni,
            fechaNac: response.data.fechaNac,
            email: response.data.email,
            telefono: response.data.telefono,
            direccion: response.data.direccion,
            sueldo: response.data.sueldo,
            especialidadMedica: response.data.especialidadMedica,
          })

          let turnList = response.data.listaTurno;

          // El fetch trae la lista de turnos desordenada.
          // Ordena la lista de turnos por numeroDia en orden descendente
          turnList.sort((a, b) => a.numeroDia - b.numeroDia)

          setWorkweek(response.data.listaTurno)
          setServicesSelected(response.data.serviciosMedicos)

        },
      )

    }
  }, [state])
  

  
  // Envia esta funcion a DragAndDrop para que setee el/los servicio(s)
  const handleServices = (services) => {
    setServicesSelected(services)
  }
 
  const handleFormSubmit = async (values) => {
    setLoading(true)

  // Prepara formulario con valores del form en si, mas los datos de servicios prestados y horario laboral
    let preparedForm = {
      ...values,
      serviciosMedicos: servicesSelected,
      listaTurno: workweek
    }

    await axios
              .post(`${route}/medico/crear`, preparedForm, {
                headers: { Authorization: "Bearer "+token }
              },)
              .then((response) => {
                  setSnackbar({
                    open: true,
                    message: state ? "Medico editado" : "Medico añadido",
                    severity: "success"
                  });
                  setLoading(false)
                

            }).catch((error) => {
                setSnackbar({
                  open: true,
                  message: "Error al intentar añadir medico.",
                  severity: "error"
                });
                setLoading(false)
            })
                
  };

  return (
    <Box m="20px">
      
      <Header title="Crear perfil de médico" subtitle="Formulario de inscripción" />
      
      <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={userSchema}
        enableReinitialize
        validateOnChange={false}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
                                          {/* Con este pedazo de codigo puedo usar span 1-4 para dividir en cuatro columnas el espacio de la caja. */}
            <Box hidden={step !== 1 ? true : false}>
              <Card sx={{pb:4, pt:2, px:2, m:2}}>
              <Typography variant="h4" color="green" mb={4}>Datos</Typography>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0,1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}}}>
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="ID"
                      value={values.id_persona}
                      name="id_persona"
                      sx={{ gridColumn: "span 4", display:"none" }}
                      disabled
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Nombre"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.nombre}
                      name="nombre"
                      error={!!touched.nombre && !!errors.nombre} // !! convierte un no boolean a un boolean invertido. En este caso significa que firstName tanto en "touched" como en "errors", debe ser verdadero para mostrar el error.
                      helperText={touched.nombre && errors.nombre}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Apellido"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.apellido}
                      name="apellido"
                      error={!!touched.apellido && !!errors.apellido} 
                      helperText={touched.apellido && errors.apellido}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="DNI o Cedula de identidad"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dni}
                      name="dni"
                      error={!!touched.dni && !!errors.dni} 
                      helperText={touched.dni && errors.dni}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="date"
                      label="Fecha de nacimiento"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.fechaNac}
                      name="fechaNac"
                      error={!!touched.fechaNac && !!errors.fechaNac} 
                      helperText={touched.fechaNac && errors.fechaNac}
                      sx={{ gridColumn: "span 4" }}
                  />             
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Correo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email} 
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Contacto"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.telefono}
                      name="telefono"
                      error={!!touched.telefono && !!errors.telefono} 
                      helperText={touched.telefono && errors.telefono}
                      sx={{ gridColumn: "span 2" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Dirección"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.direccion}
                      name="direccion"
                      error={!!touched.direccion && !!errors.direccion} 
                      helperText={touched.direccion && errors.direccion}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField 
                      fullWidth
                      variant="filled"
                      type="number"
                      label="Sueldo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.sueldo}
                      name="sueldo"
                      error={!!touched.sueldo && !!errors.sueldo} 
                      helperText={touched.sueldo && errors.sueldo}
                      slotProps={{
                        input: {
                          startAdornment: 
                          <InputAdornment position="start">
                            <AttachMoneyOutlined fontSize="10" />
                          </InputAdornment>
                        }
                      }}
                      sx={{ gridColumn: "span 4" }}
                  />
                  <TextField 
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Especialidad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.especialidadMedica}
                    name="especialidadMedica"
                    error={!!touched.especialidadMedica && !!errors.especialidadMedica} 
                    helperText={touched.especialidadMedica && errors.especialidadMedica}
                    sx={{ gridColumn: "span 4" }}
                  />

                </Box>
              </Card>
            </Box>
        {/* SECCION DRAG AND DROP */}
            <Box hidden={step !== 2 ? true : false}>
            <Card sx={{pb:2, m:2}}>
              <DragAndDrop handleServices={handleServices} servicesSelected={servicesSelected} step={step} />
            </Card>
            </Box>
        {/* SECCION DE HORARIO */}
            <Box hidden={step !== 3 ? true : false}>
              <WorkDaySetter 
                setWorkweek={setWorkweek}
                workweek={workweek}
                lastStep={lastStep}
                setlastStep={setlastStep}
                state={state}
              />
            </Box>
        {/* BOTONES DE NAVEGACION */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button disabled={step === 1 ? true : false} onClick={() => setStep(step-1)} type="button" color="primary" variant="contained">
              Atras
              </Button>
              <Button disabled={step === 3 ? true : false} onClick={() => setStep(step+1)} type="button" color="primary" variant="contained">
              Siguiente
              </Button>
        {/* BOTON SUBMIT */}
              <Button sx={{ml:2}} disabled={lastStep ? false : true} type="submit" color="secondary" variant="contained">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Añadir medico"}
              </Button>

            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  )
}
