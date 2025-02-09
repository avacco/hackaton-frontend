import { Card, CardContent, Container, Grid2, Typography } from "@mui/material";
import { FaBone, FaBrain, FaBriefcaseMedical, FaHeartbeat, FaStethoscope, FaTooth } from "react-icons/fa";
import { Footer } from "../../../components/Footer";
import GlobalCarousel from "../../../components/GlobalCarousel";

const Services = () => {

  // Servicios con su icono, titulo y descripcion. Idealmente se haria un fetch de los servicios a la db, pero ¿como sacaria el icono para cada servicio? Si hay tiempo, habrá que probar esto.
  const services = [
    { icon: <FaStethoscope size={40} />, title: "Consultas médicas", description: "Agenda una consulta con uno de nuestros especialistas" },
    { icon: <FaHeartbeat size={40} />, title: "Cardiología", description: "Cuidado y tratamiento experto para la salud del corazón" },
    { icon: <FaBrain size={40} />, title: "Neurología", description: "Tratamientos avanzados para cuidar la sanidad mental" },
    { icon: <FaBone size={40} />, title: "Ortopedía", description: "Cuidado especializado para huesos y articulaciones" },
    { icon: <FaTooth size={40} />, title: "Odontología", description: "Emergencias dentales y cuidado general de la salud bucal" },
    { icon: <FaBriefcaseMedical size={40} />, title: "Cuidados generales", description: "Orientación sobre el cuidado general de la salud" }
  ];

  return (
    <>
      { location.href.includes("/services") &&
        <GlobalCarousel />
      }
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" mb={6}>
          Nuestros servicios
        </Typography>
        <Grid2 display="flex" justifyContent="center"  container spacing={4}>
          {services.map((service, index) => (
            <Card sx={{
              minWidth: 300,
              maxWidth: 300,
              height: "100%",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)"
              }
            }} key={index}>
              <CardContent sx={{ textAlign: "center" }}>
                {service.icon}
                <Typography variant="h6" mt={2}>
                  {service.title}
                </Typography>
                <Typography color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid2>
      </Container>
      { location.href.includes("/services") &&
        <Footer />
      }
    </>
  )
}

export default Services