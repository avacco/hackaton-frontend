import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { Footer } from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate()

  return (
      <>
      <Container sx={{
        pt:5,
        display:"flex",
        justifyContent:"center",
        fontSize: "1.1rem",
      }} maxWidth="md">
        <Box>
        <Typography
            textAlign="center"
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, fontSize:280, my:10 }}
          >
            404
          </Typography>
          <Typography
            textAlign="center"
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Página no encontrada
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}
          >
            La página que buscas no existe o se ha cambiado de ruta. Presiona el botón para volver al inicio.
          </Typography>
          <Button
            sx={{fontSize: "1.1rem", my: 3}}
            variant="contained"
            color="primary"
            startIcon={<FaArrowLeft />}
            onClick={() => navigate("/")}
          >
            Inicio
          </Button>
        </Box>
      </Container>
    <Footer />
    </>
  );
};

export default NotFound;