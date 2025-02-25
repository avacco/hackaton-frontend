import React, { useState } from 'react'
import Header from '../../../components/Header'
import { Alert, Box, Button, Card, Grid2, IconButton, Snackbar, Typography } from '@mui/material'
import { DownloadOutlined, EmailOutlined } from '@mui/icons-material'
import Linechart from './components/LineChart'
import Piechart from './components/PieChart'
import Barchart from './components/BarChart'
import StatBox from './components/StatBox'
import { nivoLine, nivoPie, nivoBar } from '../../../../data/mockdata';
import axios from 'axios'
import { useAuth } from '../../../provider/AuthProvider'

export default function Dashboard() {

  const [pieData, setPieData] = useState(nivoPie)
  const [lineData, setLineData] = useState(nivoLine)
  const [otherLineData, setOtherLineData] = useState(nivoLine)
  const [barData, setBarData] = useState(nivoBar)

  const [isLoading, setLoading] = useState(false)

  const route = import.meta.env.VITE_API_ROUTE;
  const { token } = useAuth();

  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  const fetchData = async () => {
    setLoading(true)
    
    // LINEA 1
    await axios
    .get(`${route}/consulta_medica/conteoMeses`, {
      headers: { Authorization: "Bearer "+token }
    },)
    .then((line) => {

      // Prepara datos para grafico de linea
      let preparedLineData = []

      // Por cada item entregado por el back, crea un objeto Map que es transformado a Object
      // Y asigna los valores necesarios para que los reconozca el grafico.
      // Los guarda dentro del array de datos preparados.
      line.data.forEach((item)=> {

        let lineMap = new Map();
        lineMap.set('x', item.mes)
        lineMap.set('y', item.conteo)
  
        let myObj = Object.fromEntries(lineMap)
        preparedLineData.push(myObj)

    })

      // Reemplaza los datos de muestra con los datos preparados
      setLineData([{
        "id": "Servicios",
        "data": preparedLineData
      }]);
      
      
  }).catch((error) => {
      setSnackbar({
        open: true,
        message: "Error al traer datos de linea.",
        severity: "error"
      });
      console.log(error)
  })

    // TORTA
    await axios
    .get(`${route}/consulta_medica/conteoServicios`, {
      headers: { Authorization: "Bearer "+token }
    },)
    .then((pie) => {
      console.log("PIE DATA")
      console.log(pie.data)

      // Estos datos son traidos tal cual son necesitados
      setPieData(pie.data)

      
  }).catch((error) => {
      setSnackbar({
        open: true,
        message: "Error al traer datos de torta.",
        severity: "error"
      });
      console.log(error)
  })

    // BARRA
    await axios
    .get(`${route}/consulta_medica/graficogenero`, {
      headers: { Authorization: "Bearer "+token }
    },)
    .then((bar) => {

      // Prepara datos para grafico
      setBarData([bar.data])

  }).catch((error) => {
      setSnackbar({
        open: true,
        message: "Error al traer datos de barra.",
        severity: "error"
      });
  }).finally(setLoading(false))

  }


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center"> 
        <Header title="Dashboard" subtitle="Bienvenido" />    
      </Box>

      <Button disabled={isLoading} variant='outlined' onClick={fetchData}>Cargar datos</Button>
    {/* Cards, ya no hay tiempo para terminar esto */}
{/* 
      <Grid2 display="flex" mt={2} justifyContent="center" container gap={1}>
        <Grid2 size={{md:2.5, sm:5}}>
        <StatBox
            title="12.345"
            subtitle="Datos recibidos"
            progress="0.60"
            increase="+40%"
            icon={<EmailOutlined sx={{fontSize:"26px"}}/>}
          />
        </Grid2>
        <Grid2 size={{md:2.5, sm:5}}>
        <StatBox
            title="12.345"
            subtitle="Datos recibidos"
            progress="1.00"
            increase="+100%"
            icon={<EmailOutlined sx={{fontSize:"26px"}}/>}
          />
        </Grid2>
        <Grid2 size={{md:2.5, sm:5}}>
        <StatBox
            title="12.345"
            subtitle="Datos recibidos"
            progress="0.40"
            increase="+35%"
            icon={<EmailOutlined sx={{fontSize:"26px"}}/>}
          />
        </Grid2>
        <Grid2 size={{md:2.5, sm:5}}>
        <StatBox
            title="12.345"
            subtitle="Datos recibidos"
            progress="0.20"
            increase="+22%"
            icon={<EmailOutlined sx={{fontSize:"26px"}}/>}
          />
        </Grid2>
      </Grid2>
*/}      
      {/* Graficos de lineas y barras */}
      <Grid2 container>
        <Grid2 size={{lg:12}} mt={2} >
          <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Grafico de linea<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="100%" ml="-10px">
              <Linechart data={lineData} />
            </Box>
          </Card>
        </Grid2>
      </Grid2>
      {/* Graficos de barra y torta */}
      <Grid2 container gap={1}>
        <Grid2 size={{md: 12, lg:8.9}} mt={2} >

        <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Servicios mas pedidos<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="100%" ml="-20px">
              <Piechart data={pieData} />
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={{md: 12, lg:3}} mt={2}>
        <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Pacientes por sexo<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="100%" ml="-10px">
              <Barchart data={barData} />
            </Box>
          </Card>

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
    </Box>

  )
}
