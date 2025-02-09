import {  Box,  Button, Card,  CardContent, CardMedia,  Container,  Typography, Grid2 } from "@mui/material";
import { Footer } from "../../../components/Footer";
import Information from "./components/Information";
import GlobalCarousel from "../../../components/GlobalCarousel";
import Services from "./components/Services";

const Homepage = () => {

  // Estilos de cards para no amontonarlas en los componentes
  const newsCard = {
    minWidth: 300,
    maxWidth: 300,
    margin: "16px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)"
    }
  }

  // Noticias, en principio solo un concepto, pues no esta planeado hacer una seccion de noticias, pero sin ellas la homepage se veria muy vacia.
  const news = [
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      title: "Avances medicos",
      excerpt: "Los ultimos avances medicos del pasado año 2024..."
    },
    {
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
      title: "Tips de salud para este invierno",
      excerpt: "Manténgase saludable en los proximos dias helados con estos tips..."
    },
    {
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
      title: "Las lecciones que nos dejó el COVID-19",
      excerpt: "Información a tener en cuenta sobre la pasada pandemia..."
    }
  ];

  return (
    <Box>
      <GlobalCarousel />

      {/* Sección servicios */}
      <Services />

      {/* Sección información */}
      <Information />

      {/* Sección noticias */}
      <Box sx={{py: 4 }}>
        <Container>
          <Typography variant="h3" textAlign="center" mb={6}>
            Noticias
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              pb: 2
            }}
          >
            <Grid2 container display="flex" justifyContent="center" spacing={4}>
            {news.map((item, index) => (
              <Card sx={newsCard} key={index}>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.excerpt}
                  </Typography>
                  <Button sx={{ mt: 2 }} color="primary">
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            ))}
            </Grid2>
          </Box>
        </Container>
      </Box>
      {/* Sección mapa */}
      <Container sx={{my:10}}>
        <Typography variant="h3" textAlign="center" mb={6}>
          Donde encontrarnos
        </Typography>
        <Box sx={{ display: "flex", overflowX: "auto", p:1 , boxShadow:3}}>
          <iframe width="100%" height="600" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Avenida%20Acoyte%20100+(Clinica%20Medica)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Homepage;