import { Alert, Box, Button, ButtonGroup, Card, Checkbox, CircularProgress, Container, FormControlLabel, Grid2, Snackbar, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useState } from "react";
import axios from "axios";
import DragAndDrop from "./components/DragAndDrop";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DigitalClock, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

//TODO: Refinar y ajustar, que este componente es delicado y sus piezas aun mas.

export default function Form() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const route = import.meta.env.VITE_API_ROUTE;
  const { token } = useAuth();
 
  // Valores iniciales para campos de formulario
  const initialValues = {
    nombre: "Patricio",
    apellido: "Garcia",
    dni: "9126251",
    fechaNac: "1990-06-10",
    email: "p.garcia.90@gmail.com",
    telefono: "54120706721",
    direccion: "Pj. Coronel 512",
    sueldo: "3500000",
    especialidadMedica: "Neurologo",
  };

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

  // Para botones de dia de la semana.
  const [selectedDay, setSelectedDay] = useState("MONDAY")
  
  // Pasos del formulario. Ocultan una parte de este segun su paso.
  const [step, setStep] = useState(1)

  // Para setear hora de inicio y finalizacion de jornada y si es un dia laboral.
  const [startHour, setStartHour] = useState("")
  const [finishHour, setfinishHour] = useState("")
  const [isRestDay, setIsRestDay] = useState(false);

  // Para guardar la semana laboral
  const [workweek, setWorkweek] = useState([])

  const [defaultTime, setdefaultTime] = useState(dayjs('2025-02-12T08:00'))
  const [servicesSelected, setServicesSelected] = useState([])
  const [loading, setLoading] = useState(false)

  const [lastStep, setlastStep] = useState(false)
  
  // Envia esta funcion a DragAndDrop para que setee el/los servicio(s)
  const handleServices = (services) => {
    setServicesSelected(services)
  }

  const handleStartHour = (hour) => {
    setStartHour(hour)
  }

  const handleFinishHour = (hour) => {
    setfinishHour(hour)
  }

  // Elimina el ultimo dia añadido a la semana laboral y retrocede un paso en los dias laborales.
  const undoWorkday = () => {

    workweek.pop()

    switch (selectedDay) {

      case "TUESDAY":
        setSelectedDay("MONDAY")        
        break;

      case "WEDNESDAY":
        setSelectedDay("TUESDAY")
        break;

      case "THURSDAY":
        setSelectedDay("WEDNESDAY") 
        break;

      case "FRIDAY":
        setSelectedDay("THURSDAY")
        break;

      case "SATURDAY":
        setSelectedDay("FRIDAY")
        break;

      case "SUNDAY":
        setlastStep(false)
        setSelectedDay("SATURDAY")
        break;
    
      default:
        break;
    }

  }


  const confirmWorkday = () => {

    console.log(`Hora inicio: ${startHour.format("HH:mm")}`)
    console.log(`Hora termino: ${finishHour.format("HH:mm")}`)
    console.log("day: "+selectedDay)

    let workDay = {
      horaInicio: startHour.format("HH:mm"),
      horaFinal: finishHour.format("HH:mm"),
      diaSemana: selectedDay,
      descanso: isRestDay
    }

    workweek.push(workDay)

    console.log(workweek)

    switch (selectedDay) {
      case "MONDAY":
        setSelectedDay("TUESDAY")
        break;
      
      case "TUESDAY":
        setSelectedDay("WEDNESDAY")        
        break;

      case "WEDNESDAY":
        setSelectedDay("THURSDAY")
        break;

      case "THURSDAY":
        setSelectedDay("FRIDAY")
        break;

      case "FRIDAY":
        setSelectedDay("SATURDAY")
        break;

      case "SATURDAY":
        setSelectedDay("SUNDAY")
        break;

      case "SUNDAY":
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
                    message: "Medico añadido",
                    severity: "success"
                  });
                  setLoading(false)
                

            }).catch((error) => {
              console.log(error)
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
      
      <Header title="Crear perfil de médico" />
      <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
                                          {/* Con este pedazo de codigo puedo usar span 1-4 para dividir en cuatro columnas el espacio de la caja. */}
            <Box hidden={step !== 1 ? true : false}>
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0,1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}}}>
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
            </Box>
            <Box hidden={step !== 2 ? true : false}>
              <DragAndDrop handleServices={handleServices} />
            </Box>

            <Box hidden={step !== 3 ? true : false}>
              <Typography> Jornada laboral</Typography>
              <ButtonGroup disabled sx={{mb:10, mt:4}} variant="contained">
              {daysOfWeek.map((item) => (
                <Button 
                  sx={{color:"black!important"}}
                  key={item.id} 
                  variant={selectedDay === item.send ? "contained" : "text"}
                  onClick={() => { setSelectedDay(item.send)} }
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Typography variant="h4" align="center" gutterBottom>
                      Hora inicio
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                      Seleccione una hora
                    </Typography>
                    <DigitalClock 
                      sx={{scrollbarWidth:'none', ml:2}} 
                      defaultValue={defaultTime} 
                      ampm={false} 
                      minTime={dayjs().hour(7)}
                      maxTime={dayjs().hour(20).minute(0)}
                      onChange={handleStartHour}
                    />
                  </LocalizationProvider>
                </Grid2>
                <Grid2 size={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Typography variant="h4" align="center" gutterBottom>
                      Hora termino
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                      Seleccione una hora
                    </Typography>
                    <DigitalClock 
                      sx={{scrollbarWidth:'none', ml:2}} 
                      defaultValue={defaultTime} 
                      ampm={false} 
                      minTime={dayjs().hour(7)}
                      maxTime={dayjs().hour(20).minute(0)}
                      onChange={handleFinishHour}
                    />
                  </LocalizationProvider>
                </Grid2>
              </Grid2>
              <Button disabled={lastStep} sx={{my:2}} variant="contained" onClick={confirmWorkday}>Confirmar jornada</Button>
              <Button sx={{m:2}} disabled={selectedDay === "MONDAY" ? true : false} variant="contained" onClick={undoWorkday}>Deshacer jornada</Button>
            </Box>
            
            <Box display="flex" justifyContent="end" mt="20px">
              <Button disabled={step === 1 ? true : false} onClick={() => setStep(step-1)} type="button" color="secondary" variant="contained">
              Atras
              </Button>
              <Button variant="outlined" onClick={() => console.log(workweek)}>check</Button>
              <Button disabled={step === 3 ? true : false} onClick={() => setStep(step+1)} type="button" color="secondary" variant="contained">
              Siguiente
              </Button>
              <Button disabled={step === 3 ? false : true} type="submit" color="secondary" variant="contained">
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
