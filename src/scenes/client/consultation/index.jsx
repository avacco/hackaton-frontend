import React, { useEffect, useState } from "react";
import { Card,  CardContent,  TextField,  Button,  Typography,  Select,  MenuItem,  FormControl,  InputLabel,  Container,  Box,  Alert,  Snackbar, Grid2, Fade, Modal, Backdrop, Collapse } from "@mui/material";
import { BsTelephone, BsEnvelope, BsClock, BsGeoAlt } from "react-icons/bs";
import { Footer } from "../../../components/Footer";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import * as yup from 'yup';
import { Formik } from "formik";
import { DigitalClock, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import es from 'dayjs/locale/es';
import GlobalCarousel from "../../../components/GlobalCarousel";
import axios from "axios";

const Consultation = () => {

  // Controla los dias que deben ser habilitados. Por defecto estan todos deshabilitados, estos se encargan de habilitarlos.
  const today = dayjs().startOf("day");
  const lastEnabledDate = today.add(4, "day");
  
  // Define las fechas que estaran habilitadas. Esto debe ser conectado a una api para traer los turnos y horarios de los doctores.
  const shouldDisableDate = (date) => {
    const currentDate = dayjs(date);
    return currentDate.isBefore(today) || currentDate.isAfter(lastEnabledDate);
  };

  // Controles de modal
  const [openModal, setOpenModal] = useState(false)
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // Estados de cards
  const [doctorDropdown, setDoctorDropdown] = useState(false);
  const [calendarCard, setCalendarCard] = useState(false);
  const [hourCard, setHourCard] = useState(false);
  
  // Contenedores de valores para creacion de servicio
  const [targetService, setTargetService] = useState("");
  const [targetDoc, setTargetDoc] = useState("");
  const [targetDay, setTargetDay] = useState(dayjs());
  const [targetHour, setTargetHour] = useState(dayjs());
  const [patientId, setPatientId] = useState(null);

  // Contenedores de responses
  const [services, setServices] = useState([])
  const [docs, setDocs] = useState([])

  const route = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
    axios
        .get(`${route}/servicio_medico/traer`)
        .then(response => {
          setServices(response.data)
        })
        .catch((error) => {
          console.log(error);
        })
  }, [])
  
  const checkServices = () => {
    console.log(docs);
  }

   // Control de primer paso
   const handleServiceSelection = async (e) => {
    setDoctorDropdown(true); // abre dropdown de doctor, cierra los demas si estaban abiertos

    axios
        .get(`${route}/medico/servicio_con_medicos/${e.target.value}`)
        .then(response => {
          setDocs(response.data.nombresMedicos);
        })
        .catch((error) => {
          console.log(error);
        })

    setCalendarCard(false);
    setHourCard(false);

    setTargetService(e.target.value); // setea valor correspondiente, limpia los demas
    setTargetDoc("");
    setTargetDay(dayjs());
    setTargetHour(dayjs());
  }

  // Control de segundo paso
   const handleDoctorSelection = async (e) => {
    setCalendarCard(true);
    setHourCard(false);

    setTargetDoc(e.target.value)
    setTargetDay(dayjs());
    setTargetHour(dayjs());
  }

  // Control de tercer paso
  // Muestra en consola la fecha seleccionada. Esto sera usado para enviar por api mas adelante.
  const handleDateSelection = (newDate) => {
    setTargetDay(newDate);
    setHourCard(true);
    setTargetHour(dayjs());
    console.log(`Fecha seleccionada: ${newDate.format("DD/MM/YYYY")}`); 
    
    
  };

  // Control de cuarto paso
  // Muestra en consola la hora seleccionada Esto sera usado para enviar por api mas adelante.
  const handleHourSelection = (newHour) => {
    setTargetHour(newHour);
    console.log(`Hora seleccionada: ${newHour.format("HH:mm")}`); 
    handleOpen();
  };

  // Control de quinto paso

  const handlePatientFetch = async (values) => {
    if (loading) return;

    console.log(values);
    console.log(values.fetchdni);
    setLoading(true);

    try {

      // throw new Error;

      await new Promise(resolve => setTimeout(resolve, 1500));
      setSnackbar({
        open: true,
        message: "Paciente ha sido registrado antes",
        severity: "success"
      });
      // saltarse el sexto paso e ir directo al septimo

    } catch (error) {
      setSnackbar({
        open: true,
        message: "Paciente no registrado, por favor rellene el formulario",
        severity: "info"
      });

      setPatientId(values.fetchdni);
      
    } finally {
      setLoading(false);
    }

  }

  // Control de sexto paso opcional
  const handleFormSubmit = async (values) => {
    if (loading) return;

    setLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSnackbar({
        open: true,
        message: "exito.",
        severity: "success"
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ha ocurrido un error.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };


  // Valores para formulario
  // TODO: Terminar formulario de paciente
  const initialValues = {
    firstName: "Andres",
    lastName: "Vargas",
    email: "correo@correo.com",
    phone: "56912123434",
    reason: "Otro",
    message: "Prueba de formulario",
  }

  const fetchInitialValues = {
    fetchdni: "123456789",
  }
  
  // Esquema de validacion de yup
  const formSchema = yup.object().shape({
    firstName: yup.string().required("Requerido"),
    lastName: yup.string().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    phone: yup.number().required("Requerido"),
    reason: yup.string().required("Requerido"),
    message: yup.string().required("Requerido")
  })

  // Styles para Box de cards
  const cardBox ={display: "flex",  alignItems: "center",  marginBottom: "1rem",  gap: "1rem"}

  // Control de estado de cargando y snackbar para el form
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  return (
    <>
    <GlobalCarousel />
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Grid2 container spacing={4} display='flex'>
        <Grid2 size={{xs:12, md:5}}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Servicios requeridos 
              </Typography>
              
              <Box sx={cardBox}>
              <FormControl fullWidth required>
                  <InputLabel>Servicio</InputLabel>
                  <Select
                    name="service"
                    value={targetService}
                    label="Servicio"
                    onChange={handleServiceSelection}
                  >
                    {services.map((item) => (
                      <MenuItem key={item.codigo_servicio} value={item.codigo_servicio}>{item.nombre}</MenuItem>
                    ))}

                  </Select>
                </FormControl>
              </Box>
              <Box sx={cardBox}>
                <Collapse orientation='vertical' in={doctorDropdown}>
                  <FormControl sx={{minWidth:"370px"}} required>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      name="doctor"
                      value={targetDoc}
                      label="Doctor"
                      onChange={handleDoctorSelection}
                    >

                    {docs.map((item) => (
                      <MenuItem key={item.id_medico} value={item.id_medico}>{item.nombre}</MenuItem>
                    ))}

                    </Select>
                  </FormControl>
                </Collapse>

              </Box>

              <Box sx={cardBox}>
                <Box>
                  <Button onClick={checkServices} variant="contained">check</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{xs:12, md:5}}>
        <Collapse orientation='vertical' in={calendarCard}>
          <Card sx={{display:'flex', justifyContent:'center'}}>
            <CardContent>
              <Typography align="center" variant="h4" gutterBottom>
                Calendario
              </Typography>
              <Box sx={cardBox}>
                <Box>
                  <Typography variant="h6" align="center" gutterBottom>
                    Días disponibles
                  </Typography>
                  <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      sx={{
                        "& .MuiPickersDay-root": {
                          fontSize: "0.875rem",
                          margin: "2px"
                        }}}
                      value={targetDay}
                      onChange={handleDateSelection}
                      shouldDisableDate={shouldDisableDate}
                      disablePast
                    />
                  </LocalizationProvider>
                  <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
                    Solo los dias disponibles pueden ser seleccionados
                  </Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
          </Collapse>
        </Grid2>

        <Grid2 size={{xs:12, md:2}}>
        <Collapse orientation='vertical' in={hourCard}>
          <Card sx={{display:'flex', justifyContent:'center'}}>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Hora
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                Seleccione una hora
              </Typography>
              <Box sx={cardBox}>
                <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DigitalClock 
                    sx={{scrollbarWidth:'none', ml:2}} 
                    defaultValue={dayjs('2025-02-12T08:00')} 
                    ampm={false} 
                    onChange={handleHourSelection} 
                    minTime={dayjs().hour(7)}
                    maxTime={dayjs().hour(20).minute(0)}
                  />
                </LocalizationProvider>
                </Box>
              </Box>
            </CardContent>
          </Card>
          </Collapse>
        </Grid2>
      </Grid2>

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
    </Container>
    <Footer />

    <Modal
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Card sx={{ height: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <CardContent>
                { patientId ? (
                  <>
                    <Typography variant="h2" gutterBottom>
                      Datos del paciente
                    </Typography>
                    <Formik
                      onSubmit={handleFormSubmit}
                      initialValues={initialValues}
                      validationSchema={formSchema}
                    >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Grid2 container spacing={2}>
                          <Grid2 size={6}>
                            <TextField
                              fullWidth
                              label="Nombre"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              error={!!touched.firstName && !!errors.firstName}
                              helperText={touched.firstName && errors.firstName}
                              required
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <TextField
                              fullWidth
                              label="Apellido"
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              error={!!touched.lastName && !!errors.lastName}
                              helperText={touched.lastName && errors.lastName}
                              required
                            />
                          </Grid2>
                          
                            <TextField
                              fullWidth
                              label="Correo"
                              name="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              error={!!touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                              required
                            />
                          
                            <TextField
                              fullWidth
                              label="Número de contacto"
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                              error={!!touched.phone && !!errors.phone}
                              helperText={touched.phone && errors.phone}
                            />
                          
                            <FormControl fullWidth required error={!!errors.reason}>
                              <InputLabel>Motivo por el contacto</InputLabel>
                              <Select
                                name="reason"
                                value={values.reason}
                                onChange={handleChange}
                                label="Motivo por el contacto"
                              >
                                <MenuItem value="Consulta general">Consulta general</MenuItem>
                                <MenuItem value="Sugerencias">Sugerencias</MenuItem>
                                <MenuItem value="Reclamos">Reclamos</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                              </Select>
                            </FormControl>
                          
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Mensaje"
                              name="message"
                              value={values.message}
                              onChange={handleChange}
                              placeholder="Detalle el motivo de contacto..."
                            />
                          
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              fullWidth
                              disabled={loading}
                            >
                              {loading ? "Enviando..." : "Enviar mensaje"}
                            </Button>
                        </Grid2>
                      </form>
                      )}
                    </Formik>
                  </>
                  ) : (
                  <>
                  <Typography align='center' variant="h4" gutterBottom>
                      Resultados
                    </Typography>
                    <Formik
                        onSubmit={handlePatientFetch}
                        initialValues={fetchInitialValues}
                      >
                      {({ values, errors, touched, handleChange, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Box>
                          <TextField
                            fullWidth
                            label="Cédula o DNI"
                            name="fetchdni"
                            value={values.fetchdni}
                            onChange={handleChange}
                            placeholder="Cédula o DNI"
                          />
                          <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              fullWidth
                              disabled={loading}
                            >
                              Consultar
                          </Button>
                        </Box>
                      </form>
                      )}
                    </Formik>
                  </>
                  )}
                
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>

    </>
  );
};

export default Consultation;