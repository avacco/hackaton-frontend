import { Card, CardContent, Container, Grid2, Typography } from "@mui/material";
import { FaAngry, FaBone, FaBrain, FaBriefcaseMedical, FaChild, FaEye, FaHandHolding, FaHeadSideVirus, FaHeart, FaHeartbeat, FaStethoscope, FaTooth, FaWheelchair } from "react-icons/fa";
import { Footer } from "../../../../components/Footer";
import GlobalCarousel from "../../../../components/GlobalCarousel";

const Services = () => {

  // Servicios con su icono, titulo y descripcion. Idealmente se haria un fetch de los servicios a la db, pero ¿como sacaria el icono para cada servicio? Si hay tiempo, habrá que probar esto.
  const services = [
    { icon: <FaStethoscope size={40} />, title: "Atención Primaria", description: "Agenda una consulta con uno de nuestros especialistas", longDesc: "La atención primaria es el primer punto de contacto para los pacientes. En este servicio se brindan consultas generales, diagnóstico y tratamiento de enfermedades comunes, así como la promoción de la salud y la prevención de enfermedades. Los médicos de atención primaria actúan como coordinadores del cuidado del paciente, derivándolos a especialistas si es necesario." },
    { icon: <FaHeartbeat size={40} />, title: "Cardiología", description: "Cuidado y tratamiento experto para la salud del corazón", longDesc:  "La cardiología se dedica al diagnóstico y tratamiento de enfermedades del corazón y del sistema circulatorio. Los cardiólogos realizan evaluaciones de riesgo cardiovascular, electrocardiogramas (ECG), ecocardiogramas, pruebas de esfuerzo, y otros estudios para detectar problemas cardíacos. También ofrecen tratamientos y seguimiento para enfermedades como hipertensión, insuficiencia cardíaca y arritmias."},
    { icon: <FaBrain size={40} />, title: "Neurología", description: "Prevención, diagnóstico y tratamiento de enfermedades del sistema nervioso", longDesc: "La neurología se enfoca en el diagnóstico y tratamiento de enfermedades del sistema nervioso central y periférico. Los neurólogos atienden pacientes con trastornos como epilepsia, esclerosis múltiple, enfermedad de Parkinson, migrañas, accidentes cerebrovasculares y neuropatías. Realizan estudios neurológicos y ofrecen tratamientos especializados para mejorar la calidad de vida de los pacientes." },
    { icon: <FaEye size={40} />, title: "Oftalmología", description: "Cuidados para los ojos y salud visual en general", longDesc: "El servicio de oftalmología se dedica al cuidado de la salud visual. Los oftalmólogos realizan exámenes de la vista, diagnostican y tratan enfermedades oculares como cataratas, glaucoma, degeneración macular y enfermedades de la retina. Además, prescriben gafas y lentes de contacto, y realizan cirugías oculares cuando es necesario." },
    { icon: <FaChild size={40} />, title: "Pediatría", description: "Especialistas en atención a menores de edad", longDesc: "El servicio de pediatría está especializado en la atención de bebés, niños y adolescentes. Los pediatras se encargan del seguimiento del crecimiento y desarrollo infantil, la administración de vacunas, el tratamiento de enfermedades infantiles, y la orientación a los padres sobre temas relacionados con la salud y el bienestar de sus hijos." },
    { icon: <FaHandHolding size={40} />, title: "Dermatología", description: "Diagnóstico, tratamiento y manejo de enfermedades de la piel", longDesc: "El servicio de dermatología se ocupa de la salud de la piel, el cabello y las uñas. Los dermatólogos diagnostican y tratan una amplia variedad de afecciones dermatológicas, incluyendo acné, dermatitis, psoriasis, infecciones cutáneas, y cáncer de piel. También ofrecen tratamientos estéticos como la eliminación de verrugas y lunares, y procedimientos para mejorar la apariencia de la piel." },
    { icon: <FaHeadSideVirus size={40} />, title: "Psicología", description: "Apoyo para el bienestar emocional y mental", longDesc: "El servicio de psicología y salud mental ofrece apoyo para el bienestar emocional y mental de los pacientes. Los psicólogos realizan evaluaciones, diagnóstico y tratamiento de trastornos como depresión, ansiedad, estrés, trastornos de la alimentación, y problemas de comportamiento. También brindan terapia individual, de pareja y familiar, y programas de manejo del estrés y habilidades de afrontamiento." },
    { icon: <FaBriefcaseMedical size={40} />, title: "Endocrinología", description: "Diagnóstico y tratamiento para alteraciones hormonales", longDesc: "La endocrinología se especializa en el diagnóstico y tratamiento de trastornos hormonales y metabólicos. Los endocrinólogos tratan enfermedades como diabetes, hipertiroidismo, hipotiroidismo, trastornos de la glándula suprarrenal, y problemas de crecimiento. También ofrecen manejo y seguimiento de pacientes con obesidad y disfunciones hormonales." },
    { icon: <FaWheelchair size={40} />, title: "Fisioterapia y Rehabilitación", description: "Prevención y tratamiento de lesiones y trastornos musculoesqueléticos.", longDesc: "Este servicio ofrece tratamientos para mejorar la movilidad, aliviar el dolor y recuperar la funcionalidad física después de una lesión o enfermedad. Los fisioterapeutas utilizan técnicas como ejercicios terapéuticos, masajes, electroterapia y ultrasonido para ayudar a los pacientes a rehabilitarse. También diseñan programas personalizados para la prevención de lesiones y el mantenimiento de la salud física." },
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