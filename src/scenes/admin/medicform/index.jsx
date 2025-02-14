import { Alert, Box, Button, ButtonGroup, Card, Checkbox, CircularProgress, Container, FormControlLabel, Grid2, Snackbar, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import DragAndDrop from "./components/DragAndDrop";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DigitalClock, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

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

  // Para una iteracion mas adelante. Name es el nombre para los botones y send es lo que sera enviado
  const daysOfWeek = [
    {
      id: 0, name: "Lunes", send: "MONDAY"
    },
    {
      id: 1, name: "Martes", send: "TUESDAY"
    },
    {
      id: 2, name: "Miércoles", send: "WEDNESDAY"
    },
    {
      id: 3, name: "Jueves", send: "THURSDAY"
    },
    {
      id: 4, name: "Viernes", send: "FRIDAY"
    },
    {
      id: 5, name: "Sabado", send: "SATURDAY"
    },
    {
      id: 6, name: "Domingo", send: "SUNDAY"
    },
    {
      id: 6, name: "Terminado", send: "TERMINADO"
    },
  ]


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
          setSelectedDay("TERMINADO")
        },
      )

    }
  }, [state])

  // Para botones de dia de la semana.
  const [selectedDay, setSelectedDay] = useState("MONDAY")
  const [dayNumber, setDayNumber] = useState(1)
  
  // Pasos del formulario. Ocultan una parte de este segun su paso.
  const [step, setStep] = useState(1)

  // Para setear hora de inicio y finalizacion de jornada, horas de descanso y si es un dia laboral.
  const [startHour, setStartHour] = useState(dayjs().hour(8))
  const [finishHour, setfinishHour] = useState(dayjs().hour(8))
  const [isRestDay, setIsRestDay] = useState(false);
  const [startLunch, setStartLunch] = useState(dayjs().hour(8))
  const [finishLunch, setFinishLunch] = useState(dayjs().hour(8))

  // Para guardar la semana laboral
  const [workweek, setWorkweek] = useState([])

  const [servicesSelected, setServicesSelected] = useState([])
  const [loading, setLoading] = useState(false)

  // Para activar o desactivar el boton de creación de medico.
  const [lastStep, setlastStep] = useState(false)
  
  // Envia esta funcion a DragAndDrop para que setee el/los servicio(s)
  const handleServices = (services) => {
    setServicesSelected(services)
  }

  const handleLunchStart = (hour) => {
    setStartLunch(hour)
  }

  const handleLunchFinish = (hour) => {
    setFinishLunch(hour)
  }

  const handleStartHour = (hour) => {
    setStartHour(hour)
  }

  const handleFinishHour = (hour) => {
    setfinishHour(hour)
  }

  // Elimina el ultimo dia añadido a la semana laboral y retrocede un paso en los dias laborales.
  const undoWorkday = () => {

    //TODO: Hay un problema que consiste en que si se esta en un edit en vez de un create, los turnos que sean "corregidos" tienen un nuevo ID en vez de usar el id del turno anterior
    //      Esto se debe a que la funcion de abajo elimina el valor del array y cuando se crea un nuevo turno, este viene sin ID. Cuando es enviado al backend, al ver que no hay ID, crea uno nuevo

    workweek.pop()

    setSnackbar({
      open: true,
      message: "Jornada revertida.",
      severity: "info"
    });

    switch (selectedDay) {

      case "TUESDAY":
        setSelectedDay("MONDAY")
        setDayNumber(1)        
        break;

      case "WEDNESDAY":
        setSelectedDay("TUESDAY")
        setDayNumber(2)        
        break;

      case "THURSDAY":
        setSelectedDay("WEDNESDAY") 
        setDayNumber(3)        
        break;

      case "FRIDAY":
        setSelectedDay("THURSDAY")
        setDayNumber(4)        
        break;

      case "SATURDAY":
        setSelectedDay("FRIDAY")
        setDayNumber(5)        
        break;

      case "SUNDAY":
        setDayNumber(6)        
        setSelectedDay("SATURDAY")
        break;

      case "TERMINADO":
        setlastStep(false)
        setSelectedDay("SUNDAY")
        break;
    
      default:
        break;
    }

  }


  const confirmWorkday = async () => {

    // Verifica que las fechas sean validas.
    if (finishHour.isBefore(startHour)){

      setSnackbar({
        open: true,
        message: "Horas inválidas. Término de jornada es anterior a su inicio",
        severity: "error"
      });

      return
    }

    if (finishHour.isSame(startHour)){

      setSnackbar({
        open: true,
        message: "Horas inválidas. Término e inicio de jornadas son el mismo valor",
        severity: "error"
      });

      return
    }

    if (startLunch.isSame(finishLunch)){

      setSnackbar({
        open: true,
        message: "Horas inválidas. Término e inicio de almuerzo son el mismo valor",
        severity: "error"
      });

      return
    }

    if (finishLunch.isBefore(startLunch)){

      setSnackbar({
        open: true,
        message: "Horas inválidas. Término de almuerzo es anterior a su inicio.",
        severity: "error"
      });

      return
    }

    // Si pasa las verificaciones, crea la jornada laboral con su hora de inicio, final, dia de la semana y si es o no dia de descanso.

    let workDay = {
      horaInicio: startHour.format("HH:mm"),
      horaFinal: finishHour.format("HH:mm"),
      horaInicioDescanso: startLunch.format("HH:mm"),
      horaFinalDescanso: finishLunch.format("HH:mm"),
      diaSemana: selectedDay,
      descanso: isRestDay,
      numeroDia: dayNumber
    }

    setSnackbar({
      open: true,
      message: "Jornada establecida",
      severity: "success"
    });   

    // Añade la jornada a la semana laboral
    workweek.push(workDay)

    // Cambia el dia a ser asignado, cuando llegue al ultimo, habilita el boton de enviar formulario.

    switch (selectedDay) {
      case "MONDAY":
        setSelectedDay("TUESDAY")
        setDayNumber(2)        
        break;
      
      case "TUESDAY":
        setSelectedDay("WEDNESDAY")        
        setDayNumber(3)        
        break;

      case "WEDNESDAY":
        setSelectedDay("THURSDAY")
        setDayNumber(4)        
        break;

      case "THURSDAY":
        setSelectedDay("FRIDAY")
        setDayNumber(5)        
        break;

      case "FRIDAY":
        setSelectedDay("SATURDAY")
        setDayNumber(6)        
        break;

      case "SATURDAY":
        setSelectedDay("SUNDAY")
        setDayNumber(7)        
        break;

      case "SUNDAY":
        setSelectedDay("TERMINADO")
        setlastStep(true)
        break;
    
      default:
        break;
    }

  }

  
  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );


  const handleFormSubmit = async (values) => {
    setLoading(true)

  // Prepara formulario con valores del form en si, mas los datos de servicios prestados y horario laboral
    let preparedForm = {
      ...values,
      serviciosMedicos: servicesSelected,
      listaTurno: workweek
    }

    console.log(preparedForm)

    await axios
              .post(`${route}/medico/guardar`, preparedForm, {
                headers: { Authorization: "Bearer "+token }
              },)
              .then((response) => {
                  setSnackbar({
                    open: true,
                    message: "Medico añadido",
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

            <Box hidden={step !== 2 ? true : false}>
            <Card sx={{pb:2, m:2}}>
              <DragAndDrop handleServices={handleServices} servicesSelected={servicesSelected} step={step} />
            </Card>
            </Box>

            <Box hidden={step !== 3 ? true : false}>
              <Card sx={{p:2, m:2}}>
                <Typography variant="h4" color="green"> Jornada laboral</Typography>
                <ButtonGroup disabled sx={{mb:10, mt:4}} variant="contained">
                {daysOfWeek.map((item) => (
                  <Button 
                    sx={{color:"black!important"}}
                    key={item.id} 
                    variant={selectedDay === item.send ? "contained" : "text"}
                  >
                    {item.name}
                  </Button>
                ))}
                </ButtonGroup>
                <Box>
                <FormControlLabel sx={{ml:3}} control={<Checkbox checked={isRestDay} onClick={() => setIsRestDay(!isRestDay)} />} label="Dia de descanso" />
                </Box>

                <Grid2 container>
                  <Grid2 size={6}>
                    <Card sx={{mx:2}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Typography variant="h4" align="center" gutterBottom>
                        Hora de entrada
                      </Typography>
                      <Typography variant="h6" align="center" gutterBottom>
                        Seleccione una hora
                      </Typography>
                      <DigitalClock 
                        sx={{scrollbarWidth:'none', ml:2}} 
                        ampm={false} 
                        minTime={dayjs().hour(7).minute(30)}
                        maxTime={dayjs().hour(20).minute(0)}
                        onChange={handleStartHour}
                      />
                    </LocalizationProvider>
                    </Card>
                  </Grid2>
                  <Grid2 size={6}>
                    <Card sx={{mx:2}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Typography variant="h4" align="center" gutterBottom>
                        Hora de salida
                      </Typography>
                      <Typography variant="h6" align="center" gutterBottom>
                        Seleccione una hora
                      </Typography>
                      <DigitalClock 
                        sx={{scrollbarWidth:'none', ml:2}}
                        ampm={false} 
                        minTime={startHour.add(30,"minutes")}
                        maxTime={dayjs().hour(20).minute(0)}
                        onChange={handleFinishHour}
                      />
                    </LocalizationProvider>
                    </Card>
                  </Grid2>
                </Grid2>

                <Grid2 container>
                  <Grid2 size={6}>
                    <Card sx={{mx:2, mt:4}}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Typography variant="h4" align="center" gutterBottom>
                          Inicio de almuerzo
                        </Typography>
                        <Typography variant="h6" align="center" gutterBottom>
                          Seleccione una hora
                        </Typography>
                        <DigitalClock 
                          sx={{scrollbarWidth:'none', ml:2}} 
                          ampm={false} 
                          minTime={dayjs().hour(7).minute(30)}
                          maxTime={dayjs().hour(20).minute(0)}
                          onChange={handleLunchStart}
                        />
                      </LocalizationProvider>
                    </Card>
                  </Grid2>

                  <Grid2 size={6}>
                    <Card sx={{mx:2, mt:4}}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Typography variant="h4" align="center" gutterBottom>
                          Término de almuerzo
                        </Typography>
                        <Typography variant="h6" align="center" gutterBottom>
                          Seleccione una hora
                        </Typography>
                        <DigitalClock 
                          sx={{scrollbarWidth:'none', ml:2}}
                          ampm={false} 
                          minTime={startHour.add(30,"minutes")}
                          maxTime={dayjs().hour(20).minute(0)}
                          onChange={handleLunchFinish}
                        />
                      </LocalizationProvider>
                    </Card>
                  </Grid2>
                </Grid2>
                
                <Button sx={{m:2}} disabled={workweek.length === 0 ? true : false} variant="contained" onClick={undoWorkday}>Deshacer jornada</Button>
                <Button disabled={lastStep} sx={{my:2}} variant="contained" onClick={confirmWorkday}>Confirmar jornada</Button>
              </Card>
            </Box>
            
            <Box display="flex" justifyContent="end" mt="20px">
              <Button disabled={step === 1 ? true : false} onClick={() => setStep(step-1)} type="button" color="primary" variant="contained">
              Atras
              </Button>
              <Button disabled={step === 3 ? true : false} onClick={() => setStep(step+1)} type="button" color="primary" variant="contained">
              Siguiente
              </Button>
              <Button  onClick={() => console.log(workweek)} type="button" color="primary" variant="contained">
              check
              </Button>
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
