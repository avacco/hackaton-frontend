import { Alert, Box, Button, Card, CardContent, Collapse, Container, Grid2, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import GlobalCarousel from '../../../components/GlobalCarousel'
import { Footer } from '../../../components/Footer'
import { Formik } from 'formik'
import axios from 'axios'

const Examinations = () => {

  const route = import.meta.env.VITE_API_ROUTE;
  const [selectedButton, setselectedButton] = useState(99)
  const [historyCard, setHistoryCard] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [dataCardContents, setDataCardContents] = useState({})
  const [dataCard, setDataCard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const initialValues = {
    dni: "38272561",
  }

  const iconBox ={display: "flex",  justifyContent: "center",  marginBottom: "1rem",  gap: "1rem"}

  // Consulta el historial de servicios consumidos por el paciente, segun su cédula.
  const handleFormSubmit = async (values) => {
    if (loading) return;
    setLoading(true);
    axios
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

    setselectedButton(index)

    setDataCardContents({
      nombreServicio: historyData[index].nombreServicio,
      descripcionServicio: historyData[index].descripcionServicio,
      paciente: historyData[index].nombrePaciente,
      medico: historyData[index].nombreMedico,
      pagado: historyData[index].pagadoONo,
      monto: historyData[index].montoTotal,
    })
  }

  return (
    <>
    <GlobalCarousel />
    <Container>
      <Grid2 my={10} size={{xs:12, lg:4}}>
          <Card>
            <CardContent>
              <Typography align='center' variant="h4" gutterBottom>
                Consultar historial de paciente
              </Typography>
              <Formik
                  onSubmit={handleFormSubmit}
                  initialValues={initialValues}
                >
                {({ values, handleChange, handleSubmit }) => (
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
                      variant={selectedButton === index ? "contained" : "text"} 
                      onClick={() => openInfo(index)} 
                      mb={1} key={index}
                    >
                      {item.fechaConsulta} - {item.horaConsulta}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </Collapse>
          </Grid2>

          <Grid2 size={{xs:12, md:9}}>
            <Collapse orientation='vertical' in={dataCard}>
              <Card sx={{display:'flex', justifyContent:'center'}}>
                <CardContent>
                <Typography mb={3} align="center" variant="h4" gutterBottom>Datos</Typography>
                <Grid2 container spacing={4}>
                  <Grid2 size={6}>
                    <Typography > <b>Servicio:</b> {dataCardContents.nombreServicio} </Typography>
                    <Typography > <b>Descripcion:</b> {dataCardContents.descripcionServicio} </Typography>
                    <Typography > <b>Nombre del paciente:</b> {dataCardContents.paciente} </Typography>
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography> <b>Atendido por:</b> {dataCardContents.medico} </Typography>
                    <Typography> <b>Pagado:</b> {dataCardContents.pagado} </Typography>
                    <Typography> <b>Monto:</b> ${dataCardContents.monto} </Typography>
                  </Grid2>
                </Grid2>
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
    </>
  )
}

export default Examinations