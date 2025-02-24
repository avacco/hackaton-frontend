import { Box, Button, Card, CardContent, CardHeader, CardMedia, Collapse, Container, Grid2, IconButton, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaBed, FaCalendarCheck, FaPrescription, FaQuestion } from 'react-icons/fa'
import FAQ from './infocards/FAQ'
import { Close } from '@mui/icons-material'
import Surgery from './infocards/Surgery'
import AdmissionRules from './infocards/AdmissionRules'

const Information = () => {

  const theme = useTheme();

    // Muestra una carta al cargar la pagina
    useEffect(() => {showCard("Preguntas frecuentes")}, [])
    

    // Estados para la card de informacion
    const [infoCardState, setInfoCardState] = useState(false)
    const [infoCardTitle, setInfoCardTitle] = useState(undefined)
    const [infoCardBody, setInfoCardBody] = useState(undefined)
    const [cardImage, setCardImage] = useState("")

    // Funcion que muestra la card y su contenido segun el topico de información pedida.
    const showCard = (topic) => {  
      switch (topic) {

        case "Informes y turnos":
          setInfoCardTitle(<Typography>Titulo con typography</Typography>)
          setInfoCardBody("Info de Informes y turnos")
          setInfoCardState(true)
          break;

        case "Indicaciones para cirugía":
          setInfoCardTitle(<Typography variant='h2'>INDICACIONES PREVIAS A SU CIRUGÍA</Typography>)
          setInfoCardBody(<Surgery />)
          setInfoCardState(true)
          setCardImage("https://images.pexels.com/photos/4421496/pexels-photo-4421496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
          break;

        case "Normas de internación":
          setInfoCardTitle(<Typography variant='h2'>NORMAS DE INTERNACIÓN</Typography>)
          setInfoCardBody(<AdmissionRules />)
          setInfoCardState(true)
          setCardImage("https://images.pexels.com/photos/6129150/pexels-photo-6129150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
          break;

        case "Preguntas frecuentes":
          setInfoCardTitle(<Typography variant='h2'>PREGUNTAS FRECUENTES</Typography>)
          setInfoCardBody(<FAQ />)
          setInfoCardState(true)
          setCardImage("https://images.pexels.com/photos/5428830/pexels-photo-5428830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
          break;
      
        default:
          setInfoCardState(false)
          break;
      }
  
    }

    // Items de informacion con su icono y titulo.
      const information = [
//      { title: "Informes y turnos", icon: <FaCalendarCheck /> },
        { title: "Indicaciones para cirugía", icon: <FaPrescription /> },
        { title: "Normas de internación", icon: <FaBed /> },
        { title: "Preguntas frecuentes", icon: <FaQuestion /> },
      ]

  return (
    
    <Container sx={{py:10}}>
      <Typography variant="h3" textAlign="center" mb={6}>
          Información
      </Typography>

      <Grid2 display="flex" justifyContent="center"  container spacing={2}>
        {information.map((info, index) =>
          <Button 
            key={index}
            sx={{minWidth: '100px', minHeight: '50px', fontSize:'large'}} 
            variant="outlined" 
            startIcon={info.icon}
            onClick={() => showCard(info.title)}
          >
            {info.title}
          </Button>
        )}
      </Grid2>
      <Collapse orientation='vertical' in={infoCardState}>
        {/* Pobla la carta con datos segun el boton de info presionado */}
          {infoCardState && 
          <Box pt={8}>
            <Card sx={{ maxWidth: "100%"}}>
              <CardMedia sx={{height:250}} image={cardImage} />
              <CardContent>
                <CardHeader action={<IconButton onClick={() => setInfoCardState(false)}> <Close /> </IconButton>} />
                <Typography textAlign="center" gutterBottom variant="h3" component="div">
                  {infoCardTitle}
                </Typography>
                <Typography variant="h5">
                  {infoCardBody}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          }
        </Collapse>
    </Container>
  
  )
}

export default Information