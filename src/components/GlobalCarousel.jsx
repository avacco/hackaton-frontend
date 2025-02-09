import { InsertInvitation } from '@mui/icons-material'
import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { useNavigate } from "react-router-dom";

const GlobalCarousel = () => {

    // Items para el carrusel. Quisiera dejar el sx en su propio const, pero no he encontrado forma de solo editar el "backgroundImage" usando el metodo de iteración.
    const items = [
      {
          box: <Box sx={{
            backgroundImage: "url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)"
            }
          }}>
            <Overrider /> {/* Mini componente que se inserta encima de estos box */}
          </Box>,
      },
      {
          box: <Box sx={{
            backgroundImage: "url(https://images.unsplash.com/photo-1584516150909-c43483ee7932)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)"
            }
          }}>
            <Overrider /> 
          </Box>,
      }
  ]

  return (
    <>
      {/* Al componente Item se le envian los items como props, y ese componente los renderiza para luego ser manejado desde este. */}
      <Carousel animation='fade' navButtonsAlwaysInvisible indicators={false}>
          {items.map( (item, i) => <Item key={i} item={item} /> )}
      </Carousel>
    </>
  )
}

// Mini componente que recibe props desde Carousel y los muestra. Necesario para el correcto funcionamiento de Carousel.
function Item(props){
  return (
      <>
        {props.item.box}
      </>
  )
}

// Mini componente que se inserta encima del carrusel.
function Overrider(){

  const navigate = useNavigate()

return (
  <Container sx={{ position: "relative", zIndex: 1 }}>
    <Typography variant="h2" color="white" gutterBottom>
      Bienvenido a Junto Salud
    </Typography>
    <Typography variant="h5" color="white" mb={4}>
      Excelencia en el cuidado de la salud
    </Typography>
    <Button onClick={() => navigate("/consultation")} startIcon={<InsertInvitation />} variant="contained" size="large" sx={{ backgroundColor: "#3498db" }}>
      Agendar hora
    </Button>
  </Container>
)
}

export default GlobalCarousel