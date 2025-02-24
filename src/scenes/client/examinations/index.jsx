import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Collapse, Container, Grid2, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import GlobalCarousel from '../../../components/GlobalCarousel'
import { Footer } from '../../../components/Footer'
import { Formik } from 'formik'
import axios from 'axios'

const Examinations = () => {

  const route = import.meta.env.VITE_API_ROUTE;
  const [ts, setselectedButton] = useState(null)
  const [historyCard, setHistoryCard] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [dataCard, setDataCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const initialValues = {
    dni: "",
  }

  const iconBox ={display: "flex",  justifyContent: "center",  marginBottom: "1rem",  gap: "1rem"}

  // Consulta el historial de servicios consumidos por el paciente, segun su cédula.
  const handleFormSubmit = async (values) => {
    if (loading) return;
    setLoading(true);
    await axios
        .get(`${route}/consulta_medica/historial/${values.dni}`)
        .then(response => {

          // Al enviar la request, la response puede venir vacia. Si esto pasa, envia un mensaje distinto que del error generico y luego termina la ejecucion del codigo.
          if(response.data.length <= 0) {
            setSnackbar({
              open: true,
              message: "Paciente no tiene registros.",
              severity: "error"
            });

            return
          }

          setHistoryData(response.data)
          setSnackbar({
            open: true,
            message: "Datos de paciente recuperados.",
            severity: "success"
          });
          setHistoryCard(true)
          setDataCard(true)
        })
        .catch((error) => {
          setSnackbar({
            open: true,
            message: "Ha ocurrido un error.",
            severity: "error"
          });
        })
        .finally(setLoading(false))
  }

  // Llena con los datos extraidos de la consulta, segun el indice requerido.
  const openInfo = (index) => {
    setselectedButton(index+1)
  }

  return (
    <>
    <GlobalCarousel />
    <Container>
            <Typography mt={6} variant="h3" textAlign="center" mb={2}>Consultar historial de paciente</Typography>
            <Typography mx={10} variant="h4" color="textSecondary" textAlign={"center"}>Estimado cliente, desde este portal puede pedir el historial de consultas agendadas, tanto pasadas como futuras. Escriba la cédula del paciente y presione en una de las fechas que aparecerán.</Typography>
      
      <Grid2 my={10} size={{xs:12, lg:4}}>
          <Card>
            <CardContent>
              <Typography align='center' variant="h4" gutterBottom>
                Ingrese cédula o DNI del paciente
              </Typography>
              <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={initialValues}
                >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Box sx={iconBox}>
                    <Box>
                      <TextField
                        fullWidth
                        label="Cédula o DNI"
                        name="dni"
                        value={values.dni}
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
                  </Box>
                </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 container spacing={2} mb={8}>
          <Grid2 size={{xs:12, md:3}}>
            <Collapse orientation='vertical' in={historyCard}>
              <Card sx={{display:'flex', justifyContent:'center'}}>
                <CardContent>
                  <Typography align="center" variant="h4" gutterBottom>
                    Historial
                  </Typography>
                  {historyData.map((item, index) => (
                    <Button 
                      variant={ts === index+1 ? "contained" : "text"} 
                      onClick={() => openInfo(index)} 
                      mb={1} key={index}
                    >
                      {item.fechaTurno} | {item.horaTurno}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </Collapse>
          </Grid2>

          <Grid2 size={{xs:12, md:9}}>
            <Collapse orientation='vertical' in={dataCard}>
              <Card 
                sx={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  flex: 1,
                  minWidth: "300px"}}
              >
                <CardHeader
                  avatar={<Avatar src="/juntosalud_mini.png" aria-label="recipe"></Avatar>}
                  action={<Typography variant="h6" mr={2} color="textSecondary" gutterBottom>00/00/00</Typography>} 
                  title={<Typography variant="h3" gutterBottom>Clínica JuntoSalud</Typography>}
                
                /> 
                  {ts && ( // TODO: Adaptar a como me lo trae el DTO del back
                  <Grid2 container m={2} p={2}>
                    <Grid2 size={6}>
                      <Typography variant="h5" gutterBottom><b>Médico asignado:</b> {historyData[ts-1].nombreMedico} {historyData[ts-1].apellidoMedico}</Typography>
                      <Typography variant="h5" gutterBottom><b>Especialidad médico:</b> {historyData[ts-1].especialidadMedica} </Typography>
                      <Typography variant="h5" gutterBottom><b>Cédula medico:</b> {historyData[ts-1].dniMedico}</Typography>
                      <Typography variant="h5" gutterBottom><b>Fecha asignada:</b> {historyData[ts-1].fechaTurno}</Typography>
                      <Typography variant="h5" gutterBottom><b>Hora asignada:</b> {historyData[ts-1].horaTurno}</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography variant="h5" gutterBottom><b>Paciente a tratar:</b> {historyData[ts-1].nombrePaciente} {historyData[ts-1].apellidoPaciente}</Typography>
                      <Typography variant="h5" gutterBottom><b>Género al nacer:</b> {historyData[ts-1].genero}</Typography>
                      <Typography variant="h5" gutterBottom><b>Cédula paciente:</b> {historyData[ts-1].dniPaciente}</Typography>
                      <Typography variant="h5" gutterBottom><b>Fecha de nacimiento:</b> {historyData[ts-1].fechaNac}</Typography>
                      <Typography variant="h5" gutterBottom><b>Contacto:</b> {historyData[ts-1].telefono}</Typography>
                      <Typography variant="h5" gutterBottom><b>Correo:</b> {historyData[ts-1].email}</Typography>
                      <Typography variant="h5" gutterBottom><b>Dirección:</b> {historyData[ts-1].direccion}</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                      <Typography variant="h5" gutterBottom><b>Servicio requerido:</b> {historyData[ts-1].nombreServicio}</Typography>
                      <Typography variant="h5" gutterBottom><b>Descripcion del servicio:</b> {historyData[ts-1].descripcion}</Typography>
                      <Typography variant="h5" gutterBottom><b>Precio original del servicio:</b> {historyData[ts-1].precio}</Typography>
                      <Typography variant="h5" gutterBottom><b>Duración esperada del servicio:</b> {historyData[ts-1].duracion}</Typography>
                      <Typography mt={5} variant="h4" gutterBottom><b>Pagado:</b> dummy</Typography>
                    </Grid2>
                  </Grid2>
                  )}
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
    </>
  )
}

export default Examinations