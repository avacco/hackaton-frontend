import { Box, Container, Grid2, IconButton, Typography } from '@mui/material'
import React from 'react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import XIcon from '@mui/icons-material/X';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {

    const navigate = useNavigate();

    // Practicamente lo mismo que en el Topbar, definen los links de navegacion rapida.
    const footerItems = [
      { title: "Inicio", nav: "/" },
      { title: "Servicios", nav: "/services" },
      { title: "Nosotros", nav: "/about" },
      { title: "Resultados de examenes", nav: "/examinations" },
      { title: "Información ", nav: "/information" },
      { title: "Realizar una consulta ", nav: "/consultation" },
      { title: "Contáctanos ", nav: "/contact" },
    ]

  return (
    <Box sx={{ backgroundColor: "#2c3e50", color: "white", py: 6 }}>
        <Container>
          <Grid2 container spacing={8}>
            <Grid2 size={{sm:6 ,lg:4}}>
              <Typography variant="h5" gutterBottom>
                Información de contacto
              </Typography>
              <Typography>Av. Acoyte 100</Typography>
              <Typography>Buenos Aires, Argentina</Typography>
              <Typography>Telefono: (54) 9 11 1234-5689 </Typography>
              <Typography>Correo: administracion@juntosalud.com</Typography>
            </Grid2>
            <Grid2 size={{sm:6 ,lg:4}}>
              <Typography variant="h5" gutterBottom>
                Links rapidos
              </Typography>
              {footerItems.map((item, index) => (
                <Typography key={index} onClick={() => navigate(item.nav)} sx={{ cursor: "pointer", mb:"1.5px" }}>{item.title}</Typography>
              ))}
            </Grid2>
            <Grid2 size={{sm:6 ,lg:4}} alignContent="flex-end">
              <Box sx={{ mt: 2 }}>
                <IconButton color="inherit">
                  <FaWhatsapp />
                </IconButton>
                <IconButton color="inherit">
                  <FaInstagram />
                </IconButton>
                <IconButton color="inherit">
                  <FaFacebookF />
                </IconButton>
                <IconButton color="inherit">
                  <XIcon />
                </IconButton>
              </Box>
            </Grid2>
          </Grid2>
          <Typography textAlign="center" mt={4}>
            © 2025 Clínica Junto Salud. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
  )
}
