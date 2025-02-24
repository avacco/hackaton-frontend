import  { Box, Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import React from 'react'

export default function FAQ() {
  
  // TODO: Añadir titulos y descripciones de preguntas frecuentes.
  const faq = [
    {
      summary: "¿Cuáles son los horarios de atención de la clínica?",
      details: "Nuestra clínica está abierta de lunes a viernes de 8:00 a 20:00 y los sábados de 7:00 a 16:00. Estamos cerrados los domingos y feriados."
    },
    {
      summary: "¿Necesito una cita previa para ser atendido?",
      details: "Sí, recomendamos encarecidamente hacer una cita previa para asegurar una atención oportuna y evitar tiempos de espera prolongados. Puede hacer su cita en línea a través de nuestro sitio web o llamando a nuestro número de contacto."
    },
    {
      summary: "¿Qué servicios médicos ofrece la clínica?",
      details: "Ofrecemos una amplia gama de servicios médicos, que incluyen atención primaria, consultas especializadas, laboratorio, radiografías, ecografías, y servicios de vacunación. Además, contamos con un equipo de especialistas en diversas áreas de la salud."
    },
    {
      summary: "¿Aceptan seguros de salud?",
      details: "Sí, aceptamos la mayoría de los seguros de salud. Le recomendamos verificar con su compañía de seguros antes de su visita para confirmar que su plan es aceptado en nuestra clínica."
    },
    {
      summary: "Derechos y obligaciones del paciente",
      details: <>
                <Typography mb={1}>Los derechos y deberes de los pacientes se refieren a la atención médica que reciben, la información que comparten con el personal de salud y el respeto a su intimidad y autonomía.</Typography>
                <b>Derechos de los pacientes</b>
                <ul>
                  <li>Recibir atencion médica sin discriminación</li>
                  <li>Recibir un trato digno y respetuoso</li>
                  <li>Tener acceso a su historia clínica</li>
                  <li>Recibir información sobre su estado de salud</li>
                  <li>Aceptar o rechazar tratamientos médicos</li>
                  <li>Tener la opcion de consultar con otros médicos</li>
                  <li>Dar su consentimiento informado para cualquier procedimiento médico</li>
                </ul>
                <b>Deberes de los pacientes</b>
                <ul>
                  <li>Comunicar de forma sincera cualquier inconveniente que se presente</li>
                  <li>Respetar el reglamento interno del establecimiento de salud</li>
                  <li>Tratar con respeto al personal de salud</li>
                  <li>Cuidar las instalaciones y el equipamiento del establecimiento de salud</li>
                </ul>
               </>
    },,
  ]

  return (
    <Box m="20px">
      {faq.map((question, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMore/>}>
            <Typography variant="h4">
            {question.summary}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {question.details}
          </AccordionDetails>
      </Accordion>
      ))}        
    </Box>
  )
}
