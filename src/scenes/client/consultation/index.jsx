import React, { useEffect, useMemo, useState } from "react";
import { Card,  CardContent,  TextField,  Button,  Typography,  Select,  MenuItem,  FormControl,  InputLabel,  Container,  Box,  Alert,  Snackbar, Grid2, Collapse, FormControlLabel, Checkbox, Fade, Modal, Backdrop, CardHeader, IconButton, Avatar } from "@mui/material";
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
import { Close } from "@mui/icons-material";

const Consultation = () => {

  // Controla los dias que deben ser habilitados. Por defecto estan todos deshabilitados, estos se encargan de habilitarlos.
  const today = dayjs().startOf("day");

  // Reservado para dias colmados
  const [blockedDates, setBlockedDates] = useState([dayjs("2025-03-03"), dayjs("2025-03-05")])

  // Controles de modal
  const [openModal, setOpenModal] = useState(false)
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // Define los dias de la semana y el horario en que el medico puede atender
  const [allowedDays, setAllowedDays] = useState([])
  const [timeBlocks, setTimeBlocks] = useState(["00:00"])
  const [startHour, setstartHour] = useState(dayjs())
  const [finishHour, setfinishHour] = useState(dayjs())
  const [missingBlocks, setMissingBlocks] = useState([])
  
  // Define las fechas que estaran habilitadas. 
  const shouldDisableDate = useMemo(() => (date) => {
    const currentDate = dayjs(date);

    if(currentDate.isBefore(today, "day")) {
      return true;
    }

    // Verifica si la fecha esta bloqueada
    const isBlocked = blockedDates.some((blockedDate) => 
      blockedDate.isSame(currentDate, "day")
    )

    if(isBlocked) return true

    // Verifica si la fecha esta permitida
    const dayOfWeek = currentDate.day();
    return !allowedDays.includes(dayOfWeek);

  }, [blockedDates, allowedDays, today])

  // Estados de cards
  const [doctorDropdown, setDoctorDropdown] = useState(false);
  const [calendarCard, setCalendarCard] = useState(false);
  const [hourCard, setHourCard] = useState(false);
  const [settingPatient, setSettingPatient] = useState(false)
  const [askForDNI, setAskForDNI] = useState(true);
  const [servicesCard, setServicesCard] = useState(false)

  // Contenedores de valores para creacion de servicio
  const [targetService, setTargetService] = useState("");
  const [targetDoc, setTargetDoc] = useState("");
  const [targetDay, setTargetDay] = useState(dayjs());
  const [targetHour, setTargetHour] = useState(dayjs());
  const [patient, setPatient] = useState({});
  const [obraSocial, setObraSocial] = useState(false);
  const [servicePack, setServicePack] = useState([])
  const [packId, setPackId] = useState(crypto.randomUUID())

  // Contenedores de responses
  const [services, setServices] = useState([])
  const [docs, setDocs] = useState([])


  const route = import.meta.env.VITE_API_ROUTE;

  // Trae los servicios medicos disponibles
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

  // Se mantiene atento por si cambia el doctor objetivo, recorre la lista de turnos del doctor y setea los adecuados para seleccionarlos en el calendario
  useEffect(() => {
    if(targetDoc.listaTurno !== undefined){
      let allowDay = []
      targetDoc.listaTurno.forEach((turn) => (
          turn.descanso ? null : allowDay.push(turn.numeroDia)
      ))
      setAllowedDays(allowDay)
    }
  }, [targetDoc])

  // Se mantiene atento por si cambia el array de bloques de tiempo, verifica si hay bloques faltantes
  useEffect(() => { checkTimes() }, [timeBlocks])


  // Desactiva bloques de tiempo especificos
  const shouldDisableTime = (value) => {

    const hour = value.hour();
    const minute = value.minute();
    
    // Desactiva bloques antes de Hora inicio y Hora fin (jornada del medico).
    if (hour < startHour.hour()) return true;
    if (hour >= finishHour.hour()) return true;


    // Verifica el array de bloques faltantes, retorna true si el bloque esta en la lista
    if (missingBlocks.includes(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)) return true;
        
    return false;
  };

  // Verifica los valores faltantes en el array de bloques de tiempo
  const checkTimes = () => {

    // Crear un array con todos los valores de tiempo posibles entre inicio y termino
    let allTimes = [];
    for (let h = startHour.hour(); h <= finishHour.hour(); h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === startHour.hour() && m < startHour.minute()) continue; // Saltar los bloques antes de inicio
        if (h === finishHour.hour() && m > finishHour.minute()) break; // Saltar los bloques después de final
        let hh = h.toString().padStart(2, "0");
        let mm = m.toString().padStart(2, "0");
        allTimes.push(`${hh}:${mm}`);
      }
    }

    // Encuentra los valores faltantes y los setea en el estado
    let missingTimes = allTimes.filter(time => !timeBlocks.includes(time));
    setMissingBlocks(missingTimes);
  }
 
  // para testeo
  const checkServices = () => {
    console.log(servicePack)
    console.log(patient)
  }
  
  // Control de primer paso (Asignacion de paciente)
  const handlePatientFetch = async (values) => {
    if (loading) return;

    setLoading(true);

      axios
        .get(`${route}/paciente/buscar/${values.fetchdni}`)
        .then(response => {
          if(response.data.length === 0){
         
            setSnackbar({
              open: true,
              message: "Paciente no ha sido registrado. Si se ha equivocado de Cédula, escribala de nuevo. Si no ha sido registrado, rellene el formulario.",
              severity: "info"
            });
            setSettingPatient(true);
          } else {
            setSnackbar({
              open: true,
              message: "Paciente ha sido registrado antes",
              severity: "success"
            });
            setPatient(response.data)
            setSettingPatient(false)
            setServicesCard(true)
            setAskForDNI(false)
          }
        })
        .catch((error) => {
          setSnackbar({
            open: true,
            message: "Error al traer paciente",
            severity: "error"
          });
        })
        .finally(setLoading(false))

  }

  // Creacion de paciente si este no existe
  const handleFormSubmit = async (values) => {

    setLoading(true);
    
    axios
      .post(`${route}/paciente/crear`, values)
      .then(response => {
        setSnackbar({
          open: true,
          message: "Paciente ha sido registrado",
          severity: "success"
        });
        setPatient(response.data);
        setAskForDNI(false)
        setServicesCard(true)
      })
      setSettingPatient(false)
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Error al registrar paciente",
          severity: "error"
        });
      })
      .finally(setLoading(false))

  };


   // Control de segundo paso paso (Seleccion de servicio)
   const handleServiceSelection = async (e) => {
    setDoctorDropdown(true); // abre dropdown de doctor, cierra los demas si estaban abiertos

    axios
        .get(`${route}/medico/servicio_con_medicos/${e.target.value.codigo_servicio}`)
        .then(response => {
          setDocs(response.data.nombresMedicos);
        })
        .catch((error) => {
          console.log(error);
        })

    setCalendarCard(false);
    setHourCard(false);

    +
    setTargetService(e.target.value); // setea valor correspondiente, limpia los demas
    setTargetDoc("");
    setTargetDay(dayjs());
    setTargetHour(dayjs());
  }

  // Control de tercer paso (Seleccion de medico)
   const handleDoctorSelection = async (e) => {
    setCalendarCard(true);
    setHourCard(false);

    setTargetDoc(e.target.value)
    
    setTargetDay(dayjs());
    setTargetHour(dayjs());

    // Los dias y horas disponibles se calculan en un useEffect mas arriba. 

  }

  // Control de cuarto paso (Seleccion de fecha)
  const handleDateSelection = (newDate) => {
    setTargetDay(newDate);
    setHourCard(true);
    setTargetHour(dayjs());

    // Verificar si el dia seleccionado esta en la lista de dias disponibles, si lo esta, setea las horas disponibles, hora de inicio y hora de termino.
    targetDoc.listaTurno.forEach((turn) => (
      turn.numeroDia === newDate.day() ? (setstartHour(dayjs(turn.horaInicio, "HH:mm")), setfinishHour(dayjs(turn.horaFinal, "HH:mm")), setTimeBlocks(turn.horaBloque)) : null
    ))
    
  };

  // Control de quinto paso (Seleccion de hora)
  const handleHourSelection = (newHour) => {
    setTargetHour(newHour);
    handleOpen();
  };

  // Control de sexto paso (Creacion de consulta y envio)
  const handleConsultationSubmit = async () => {
    if (loading) return;

    setLoading(true);
    
    // Prepara datos de consulta medica
    let preparedConsultation = {
      fechaTurno: targetDay.format("YYYY-MM-DD"),
      horaTurno: targetHour.format("HH:mm"),
      pagadoONo: "NO",
      medico: { id_persona: targetDoc.id_medico },
      paciente: { id_persona: patient.id_persona },
      servicio: { codigo_servicio: targetService.codigo_servicio },
    }
    // Añade datos de consulta medica a array de paquete de servicios
    // Usa un let porque el state de react no se refresca a tiempo para el request. Y de todos modos despues se limpia.
    let request = [...servicePack, preparedConsultation]


    let data = {
      codigo_paquete: packId,
      consultas: request
    }

    console.log(data)

    axios
      .post(`${route}/paquete_servicio/crear`, data)
      .then(response => {
        setSnackbar({
          open: true,
          message: "Consulta ha sido registrada",
          severity: "success"
        });

        // Limpia los valores para permitir una nueva consulta
        setTargetService("");
        setTargetDoc("");
        setTargetDay(dayjs());
        setTargetHour(dayjs());
        handleClose();
        setHourCard(false)
        setCalendarCard(false)
        setDoctorDropdown(false)
        setServicePack([]);

      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Error al crear consulta",
          severity: "error"
        });
      })
      .finally(setLoading(false))
  }

  // Adicion de servicio adicional
  const handleAddService = async () => {

    // Cierra el modal
    handleClose()
    setHourCard(false)
    setCalendarCard(false)
    setDoctorDropdown(false)

    // Prepara datos de consulta medica
    let preparedConsultation = {
      fechaTurno: targetDay.format("YYYY-MM-DD"),
      horaTurno: targetHour.format("HH:mm"),
      pagadoONo: "NO",
      medico: { id_persona: targetDoc.id_medico },
      paciente: { id_persona: patient.id_persona },
      servicio: { codigo_servicio: targetService.codigo_servicio },
    }
    // Añade datos de consulta medica a array de paquete de servicios
    setServicePack([...servicePack, preparedConsultation])

    setTargetService("");
    setTargetDoc("");
    setTargetDay(dayjs());
    setTargetHour(dayjs());

  }

  // Valores para formulario
  const initialValues = {
    nombre: "Andres",
    apellido: "Vargas",
    dni: "123123123",
    fechaNac: "1996-12-24",
    email: "correo@correo.com",
    telefono: "56912123434",
    direccion: "Casa",
    obraSocial: obraSocial,
  }

  const fetchInitialValues = {
    fetchdni: "",
  }
  
  // Esquema de validacion de yup
  const formSchema = yup.object().shape({
    nombre: yup.string().required("Requerido"),
    apellido: yup.string().required("Requerido"),
    dni: yup.string().required("Requerido"),
    fechaNac: yup.date().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    telefono: yup.number().required("Requerido"),
    direccion: yup.string().required("Requerido"),
    obraSocial: yup.boolean().required("Requerido"),
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
  {/* Seccion paciente */}
      <Grid2 container mt={4} spacing={4} display='flex'>
        {/* Espaciado */}
        <Grid2 size={{xs:12, md:2}}>
        {/* debug
        <Box sx={{my:2}}>
          <Button onClick={checkServices} variant="contained">check</Button>
        </Box>
        */}
        </Grid2>

        <Grid2 size={{xs:12, md:8}}>
          {/* Pide DNI */}
          <Collapse orientation='vertical' in={askForDNI}>
            <Card sx={{ height: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ m:5, mx:10}}>
                <Typography align='center' variant="h4" gutterBottom>
                    Ingrese el DNI o Cédula del paciente
                  </Typography>
                  <Formik
                      onSubmit={handlePatientFetch}
                      initialValues={fetchInitialValues}
                    >
                    {({ values, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <Box>
                        <TextField
                          fullWidth
                          label="Cédula o DNI"
                          name="fetchdni"
                          value={values.fetchdni}
                          onChange={handleChange}
                          placeholder="DNI o Cédula"
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
              </CardContent>
            </Card>
          </Collapse>
          {/* Formulario paciente */}
          <Collapse orientation='vertical' in={settingPatient}>
            <Card>
              <CardContent>
              <Typography variant="h2" gutterBottom>
                  Registro de paciente
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
                          name="nombre"
                          value={values.nombre}
                          onChange={handleChange}
                          error={!!touched.nombre && !!errors.nombre}
                          helperText={touched.nombre && errors.nombre}
                          required
                        />
                      </Grid2>
                      <Grid2 size={6}>
                        <TextField
                          fullWidth
                          label="Apellido"
                          name="apellido"
                          value={values.apellido}
                          onChange={handleChange}
                          error={!!touched.apellido && !!errors.apellido}
                          helperText={touched.apellido && errors.apellido}
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
                          label="DNI o Cédula"
                          name="dni"
                          type="dni"
                          value={values.dni}
                          onChange={handleChange}
                          error={!!touched.dni && !!errors.dni}
                          helperText={touched.dni && errors.dni}
                          required
                        />

                        <TextField 
                          fullWidth
                          label="Fecha de nacimiento"
                          name="fechaNac"
                          type="date"
                          value={values.fechaNac}
                          onChange={handleChange}
                          error={!!touched.fechaNac && !!errors.fechaNac}
                          helperText={touched.fechaNac && errors.fechaNac}
                        />
                      
                        <TextField
                          fullWidth
                          label="Número de contacto"
                          name="telefono"
                          value={values.telefono}
                          onChange={handleChange}
                          error={!!touched.telefono && !!errors.telefono}
                          helperText={touched.telefono && errors.telefono}
                        />
                      
                        <TextField
                          fullWidth
                          label="Dirección"
                          name="direccion"
                          value={values.direccion}
                          onChange={handleChange}
                          error={!!touched.direccion && !!errors.direccion}
                          helperText={touched.direccion && errors.direccion}
                        />

                        <Box>
                        <FormControlLabel 
                          onChange={handleChange}
                          name="obraSocial"
                          control={<Checkbox checked={values.obraSocial} />} 
                          label="¿Obra social?" 
                        />
                        </Box>
                      
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={loading}
                        >
                          {loading ? "Registrando..." : "Registrar paciente"}
                        </Button>
                    </Grid2>
                  </form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Collapse>
          <Collapse orientation="vertical" in={Object.keys(patient).length > 0 ? true : false}>
            <Card>
            <CardHeader 
                sx={{m:1}}
                action={<Typography color="textSecondary">{""+dayjs().format('DD/MM/YYYY')}</Typography>} 
                avatar={<Avatar src="/juntosalud_mini.png" aria-label="recipe"></Avatar>}
                title={<Typography variant="h3" gutterBottom>Clínica JuntoSalud</Typography>}
              />
              <CardContent sx={{m:2}}>
              <Grid2 container spacing={6}>
                <Grid2 size={{sm:12, md:6}}>
                {/* Info de paciente */}
                  <Typography variant="h4" my={1}>Detalles del paciente</Typography>
                  <Typography><b>Nombre:</b> {patient.nombre} {patient.apellido}</Typography>
                  <Typography><b>Cédula:</b> {patient.dni}</Typography>
                  <Typography><b>Fecha de nacimiento:</b> {patient.fechaNac}</Typography>
                  <Typography><b>Correo:</b> {patient.email}</Typography>
                  <Typography><b>Contacto:</b> {patient.telefono}</Typography>
                  <Typography><b>Dirección:</b> {patient.direccion}</Typography>
                  <Typography><b>Obra social:</b> {patient.obraSocial ? "Si" : "No"}</Typography>
                </Grid2>
                <Grid2 size={{sm:12, md:6}}>
              {/* Info de servicio */}
              {targetService && (
                  <>
                    <Typography variant="h4" my={1}>Detalles de la consulta</Typography>
                    <Typography><b>Servicio:</b> {targetService.nombre}</Typography>
                    <Typography><b>Descripción:</b> {targetService.descripcion}</Typography>
                    <Typography><b>Precio:</b> $ {targetService.precio}</Typography>
                    <Typography><b>Duración estimada:</b> {targetService.duracion}</Typography>
                    <Typography><b>Fecha:</b> {""+targetDay.format('DD/MM/YYYY')}</Typography>
                    <Typography><b>Hora:</b> {""+targetHour.format('HH:mm')}</Typography>
                    {targetDoc && (<Typography><b>Médico tratante:</b> {targetDoc.nombre} {targetDoc.apellido}</Typography>)}
                  </>
              )}    
                </Grid2>
              </Grid2>
              </CardContent>
            </Card>
          </Collapse>
        </Grid2>
        {/* Espaciado */}
        <Grid2 size={{xs:12, md:2}}>
        </Grid2>
      </Grid2>
    {/* Seccion servicios */}
      <Grid2 container spacing={4} mt={4} display='flex'>
        <Grid2 size={{xs:12, md:5}}>
        <Collapse orientation='vertical' in={servicesCard}>
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
                      <MenuItem key={item.codigo_servicio} value={item}>{item.nombre} - $ {item.precio}</MenuItem>
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
                      <MenuItem key={item.id_medico} value={item}>{item.nombre} {item.apellido}</MenuItem>
                    ))}

                    </Select>
                  </FormControl>
                </Collapse>

              </Box>
            </CardContent>
          </Card>
        </Collapse>
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
                    Solo los días disponibles pueden ser seleccionados
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
                    shouldDisableTime={shouldDisableTime}
                  />
                </LocalizationProvider>
                </Box>
              </Box>
            </CardContent>
          </Card>
          </Collapse>
        </Grid2>
      </Grid2>

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
              width: 420,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,

            }}
          >
            <Card>
              <CardHeader 
                action={<IconButton onClick={()=> handleClose()}><Close/></IconButton>} 
                avatar={<Avatar src="/juntosalud_mini.png" aria-label="recipe"></Avatar>}
               title={<Typography variant="h3" gutterBottom>Clínica JuntoSalud</Typography>}
              />
              <CardContent sx={{m:2}}>
              <Typography variant="h4" color="textSecondary">Por favor, revise que la información sea correcta. </Typography>
              <Grid2 mb={3} container spacing={6}>
                <Grid2 size={{sm:12, md:6}}>
                {/* Info de paciente */}
                  <Typography variant="h4" my={1}>Detalles del paciente</Typography>
                  <Typography><b>Nombre:</b> {patient.nombre} {patient.apellido}</Typography>
                  <Typography><b>Cédula:</b> {patient.dni}</Typography>
                  <Typography><b>Fecha de nacimiento:</b> {patient.fechaNac}</Typography>
                  <Typography><b>Correo:</b> {patient.email}</Typography>
                  <Typography><b>Contacto:</b> {patient.telefono}</Typography>
                  <Typography><b>Dirección:</b> {patient.direccion}</Typography>
                  <Typography><b>Obra social:</b> {patient.obraSocial ? "Si" : "No"}</Typography>
                </Grid2>
                <Grid2 size={{sm:12, md:6}}>
              {/* Info de servicio */}
              {targetService && (
                  <>
                    <Typography variant="h4" my={1}>Detalles de la consulta</Typography>
                    <Typography><b>Servicio:</b> {targetService.nombre}</Typography>
                    <Typography><b>Descripción:</b> {targetService.descripcion}</Typography>
                    <Typography><b>Precio:</b> $ {targetService.precio}</Typography>
                    <Typography><b>Duración estimada:</b> {targetService.duracion}</Typography>
                    <Typography><b>Fecha:</b> {""+targetDay.format('DD/MM/YYYY')}</Typography>
                    <Typography><b>Hora:</b> {""+targetHour.format('HH:mm')}</Typography>
                    {targetDoc && (<Typography><b>Médico tratante:</b> {targetDoc.nombre} {targetDoc.apellido}</Typography>)}
                  </>
              )}    
                </Grid2>
              </Grid2>
              <Typography mb={2} variant="h5" color="textSecondary">Si desea añadir servicios adicionales, presione Añadir servicio adicional, de lo contrario, confirme el pedido.</Typography>
                <Button sx={{mr:2}} variant="contained" color="primary" onClick={() => handleConsultationSubmit() }>Confirmar pedido</Button>
                <Button variant="outlined" color="info" onClick={() => handleAddService()}>Añadir servicio adicional</Button>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Modal>



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

    </>
  );
};

export default Consultation;