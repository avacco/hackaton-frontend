import React from 'react'
import Header from '../../../components/Header'
import { Box, Button, Card, Grid2, IconButton, Typography } from '@mui/material'
import BarChart from '../../../components/BarChart'
import PieChart from '../../../components/PieChart'
import LineChart from '../../../components/LineChart'
import ProgressCircle from '../../../components/ProgressCircle'
import StatBox from './components/StatBox'
import { DownloadOutlined, EmailOutlined, PieChartOutline } from '@mui/icons-material'

export default function Dashboard() {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center"> 
        <Header title="Dashboard" subtitle="Bienvenido" />    
      </Box>
      <Box>
        <Button variant="contained" color='info' sx={{fontSize:"14px", padding:"10px 20px"}} >
        <DownloadOutlined sx={{mr:"10px"}} />
        Descargar reporte
        </Button>
      </Box>

    {/* Cards */}

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
      
      {/* Graficos de lineas y barras */}
      <Grid2 container gap={2}>
        <Grid2 size={6} mt={2} >
          <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Grafico de linea<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="700px" ml="-20px">
              <LineChart />
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={4} mt={2}>
          dummy
        </Grid2>
      </Grid2>

      <Grid2 container gap={1}>
        <Grid2 size={5} mt={2} >
          <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Grafico de barras<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="700px" ml="-20px">
              <BarChart />
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={5} mt={2}>
          <Card>
            <Box m={2}>
              <Typography variant='h5' fontWeight="600">Grafico circular<IconButton><DownloadOutlined sx={{ fontSize: "26px"}} /></IconButton></Typography>
              <Typography variant='h5' fontWeight="500">Subtitulo</Typography>
            </Box>
            <Box height="350px" width="700px" ml="-20px">
              <PieChart />
            </Box>
          </Card>
        </Grid2>
      </Grid2>
    </Box>

  )
}
