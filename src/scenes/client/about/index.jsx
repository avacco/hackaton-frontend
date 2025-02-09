import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, Card, CardContent, CardMedia, Container, Grid2, useTheme, useMediaQuery, Button, ButtonGroup } from "@mui/material";
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector, timelineContentClasses } from "@mui/lab";
import { Footer } from "../../../components/Footer";
import GlobalCarousel from "../../../components/GlobalCarousel";

// Añadir o remover personal de muestra para la pagina de Equipo
const teamData = [
  {
    name: "Dra. Martina Cifuentes",
    specialty: "Cardióloga",
    bio: "15 años de experiencia en cuidado cardiovascular",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
  },
  {
    name: "Dr. Miguel Carantino",
    specialty: "Neurólogo",
    bio: "Experto en problemas neuronales",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d"
  },
  {
    name: "Dra. Emilia Valenzuela",
    specialty: "Pediatría",
    bio: "Dedicada al cuidado de la salud de los niños durante mas de 10 años",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f"
  }
];

// Hitos en la linea del tiempo pueden ser añadidos o removidos desde aqui.
const timelineData = [
  {
    year: "1990",
    title: "Fundación",
    description: "Fundada la clínica médica Junto Salud, ofreciendo servicios médicos generales y de urgencias."
  },
  {
    year: "1995",
    title: "Expansión de servicios",
    description: "Expansión de los servicios con la incorporación de una unidad de cuidados intensivos y un departamento de cardiología."
  },
  {
    year: "2000",
    title: "Integración tecnológica",
    description: "Primeros pasos en la integración de tecnologías médicas avanzadas con la adquisición de equipos de diagnóstico por imágenes de última generación"
  },
  {
    year: "2005",
    title: "Premio a la Excelencia",
    description: "Junto Salud es reconocida con el Premio a la Excelencia en Atención al Paciente por la Sociedad Médica Argentina."
  },
  {
    year: "2010",
    title: "Expansión de instalaciones",
    description: "Expansión de las instalaciones para incluir un centro de rehabilitación y fisioterapia, así como la creación de un programa de salud preventiva."
  },
  {
    year: "2015",
    title: "Lanzamiento de portal en línea",
    description: "Lanzamiento de un portal en línea para facilitar la programación de citas y la consulta de resultados médicos, mejorando la accesibilidad para los pacientes."
  },
  {
    year: "2018",
    title: "Telemedicina",
    description: "Incorporación de la telemedicina, permitiendo consultas virtuales y seguimiento remoto de pacientes, especialmente útil para áreas rurales."
  },
  {
    year: "2020",
    title: "Expansión de servicios",
    description: "Inauguración de un nuevo ala dedicada a la salud mental, con servicios de psicología y psiquiatría para atender a la comunidad de manera integral."
  },
  {
    year: "2023",
    title: "Premio a la innovación",
    description: "JuntoSalud recibe el Premio Nacional de Innovación en Salud por su enfoque en la integración de tecnologías y la mejora continua de la calidad de atención."
  },
  {
    year: "2025",
    title: "Integración de IA",
    description: "Celebración del 35º aniversario de JuntoSalud con la introducción de un programa de inteligencia artificial para apoyar el diagnóstico y tratamiento de enfermedades, consolidándose como líder en innovación médica."
  },
];


const About = () => {

  
  const theme = useTheme();
  const [selectedSection, setSelectedSection] = useState("about");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { id: "about", label: "Sobre nosotros" },
    { id: "history", label: "Nuestra historia" },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "about":
        return (
          <Container>
            <Typography variant="h3" mb={6}>Sobre nosotros</Typography>
            <CardMedia
              component="img"
              height="300"
              image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d"
              alt="Medical Facility"
              sx={{ borderRadius: 2, mb: 3 }}
            />
            <Typography variant="h5">
            Bienvenidos a Clinica Medica Junto Salud, donde su bienestar es nuestra prioridad. Fundada con el objetivo de brindar atención médica de calidad, Junto Salud combina tecnología de vanguardia con un enfoque humanitario. Nuestro equipo de profesionales está dedicado a ofrecer un cuidado integral y personalizado, asegurándose de que cada paciente reciba el tratamiento adecuado para sus necesidades específicas.
            </Typography>
            <Grid2 mt={10} container spacing={2}>
              <Grid2 size={6}>
              <Typography textAlign="center" variant="h3" gutterBottom>Misión</Typography>
                <Typography variant="h5" gutterBottom>
                Nuestra <b>misión</b> en Junto Salud es proporcionar una atención médica excepcional que promueva la salud y el bienestar de nuestra comunidad. Nos comprometemos a brindar servicios médicos de calidad, accesibles y centrados en el paciente, utilizando las mejores prácticas y la tecnología más avanzada.
                </Typography>
              </Grid2>
              <Grid2 size={6}>
              <Typography textAlign="center" variant="h3" gutterBottom>Visión</Typography>                
                <Typography variant="h5">
                Nuestra <b>visión</b> es convertirnos en un referente en la atención médica, conocida por nuestra excelencia en el cuidado del paciente, la innovación y el compromiso con la comunidad. Aspiramos a ser un lugar donde cada individuo se sienta valorado y atendido con compasión y profesionalismo.
                </Typography>
              </Grid2>
            </Grid2>
            <Typography mt={10} textAlign="center" variant="h3" gutterBottom>Valores</Typography>
              <Typography mt={2} variant="h5">
                En Junto Salud, nuestros valores fundamentales guían cada aspecto de nuestro trabajo y reflejan nuestro compromiso con la excelencia en la atención médica.
                <ul>
                <li><b>Respeto</b>: Tratamos a todos, ya sean pacientes, familiares o miembros del equipo, con el máximo respeto y dignidad. Fomentamos un ambiente inclusivo donde cada individuo se siente valorado y apreciado.</li>
                <li><b>Atención al paciente</b>: Ponemos a nuestros pacientes en el centro de todo lo que hacemos. Nos esforzamos por proporcionar una atención empática, personalizada y compasiva, asegurándonos de escuchar y entender sus necesidades.</li>
                <li><b>Ética</b>: Mantenemos los más altos estándares éticos en todas nuestras acciones y decisiones. La integridad, la honestidad y la transparencia son pilares en nuestra práctica diaria.</li>
                <li><b>Calidad</b>: Nos dedicamos a ofrecer servicios de la más alta calidad, basados en las mejores prácticas y la tecnología más avanzada. La mejora continua y la innovación son clave para mantener nuestro nivel de excelencia.</li>
                </ul>
              </Typography>
            
          </Container>
        );

      case "history":
        return (
          <Container sx={isMobile ? {} : {minWidth:"1000px"}}>
            <Typography variant="h3" gutterBottom>Nuestra Historia</Typography>
            <Timeline position="alternate">
              {timelineData.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index !== timelineData.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">{item.year}</Typography>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography color="textSecondary">{item.description}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Container>
        );

      default:
        return null;
    }
  };


  return (
    <>
    <GlobalCarousel />
      <Box sx={{ display: "flex", justifyContent:"center"}}>
        <Grid2 container spacing={2}>
          {isMobile ? (
            <ButtonGroup sx={{mt:10}} variant="contained" aria-label="Basic button group">
            {menuItems.map((item) => (
              <Button 
                key={item.id} 
                variant={selectedSection === item.id ? "contained" : "text"}
                onClick={() => { setSelectedSection(item.id)} }
              >
                {item.label}
              </Button>
            ))}
          </ButtonGroup>
          ) : (
          <Grid2 mx={1} mt={2} size="auto">
            <Card sx={{mt:10}} component="nav">
              <List>
                {menuItems.map((item) => (
                  <ListItem
                    button
                    key={item.id}
                    sx={ selectedSection === item.id ? {backgroundColor:"#ececec"} : {}}
                    selected={selectedSection === item.id ? true : false}
                    onClick={() => { setSelectedSection(item.id)} }
                  >
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid2>
          )}

          <Grid2 sx={ isMobile ? {mb:10} : {my:10} } size={{sm:10, xs:12}}>
            <Card sx={{py:4}}>
                {renderContent()}
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    <Footer />
    </>
  );
};

export default About;