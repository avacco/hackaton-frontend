import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import React from 'react'

const AdmissionRules = () => {
  const rules = [
    {
      summary: "Visitas",
      details: <>
                <Typography variant='h5' mb={2}>La presencia de los familiares y amigos durante la internación de los pacientes, es de suma importancia tanto para favorecer su recuperación como para acompañarlos en momentos difíciles. Al mismo tiempo debemos priorizar su descanso y no obstaculizar la asistencia del equipo de salud. Por dicho motivo, a fin de garantizar el correcto cuidado de los pacientes, por favor siga estas indicaciones.</Typography>
                <Typography variant='h5' fontWeight="bold" mb={2}>Información general</Typography>
                <ul>
                  <li>Horario de visita: De lunes a viernesde 10:00 a 16:00 horas</li>
                  <li>Hasta 2 visitas en ese horario</li>
                  <li>Hasta 2 personas pueden permanecer como acompañantes.</li>
                </ul>
                <Typography variant='h5' fontWeight="bold" mb={2}>Cuidados intensivos</Typography>
                <ul>
                  <li>Horarios de visita:</li>
                  <ul>
                    <li>Lunes a viernes de 10:00 a 13:00 y de 16:00 a 19:00</li>
                    <li>Hasta 2 personas pueden permanecer como acompañantes</li>
                    <li>La permanencia de visitas estará sujeto a las necesidades del sector</li>
                  </ul>
                </ul>
                <Typography variant='h5' fontWeight="bold" mb={2}>Menores de 12 años deben ser acompañados por un mayor responsable</Typography>
               </>
    },
    {
      summary: "Cambio de habitación",
      details: <>
                <Typography variant='h5' mb={2}>En caso de que el paciente requiera ser trasladado, se deberá desocupar la habitación, no dejando pertenencia alguna en ella. La Clínica se reserva el derecho de cambiar de habitación al paciente con el objetivo de ofrecer un mejor cuidado del mismo.</Typography>
               </>
    },
    {
      summary: "Alimentos",
      details: <>
                <Typography variant='h5' mb={2}>No se le debe dar alimentos al paciente (fuera de los suministrados por la Clinica), ya que estos pueden estar contraindicados en el tratamiento.</Typography>
               </>
      
    },
    {
      summary: "Alta médica",
      details: <>
                <Typography variant='h5' mb={2}>Cuando el médico tratante apruebe y deje indicaciones firmadas (Epicrisis), el paciente se considerará de Alta Médica. Para abandonar la clínica, se debera contar necesariamente con el alta médica firmada por el médico tratante.</Typography>
                <Typography variant='h5' fontWeight="bold" mb={2}>Una vez le dieron de alta, debe respetar las indicaciones del médico y poner atención en los siguientes puntos:</Typography>
                <ul>
                  <li>Tipo de dieta</li>
                  <li>Tipo de reposo</li>
                  <li>Medicación  a seguir</li>
                  <li>Fechas de control post operatorio</li>
                  <li>Controles especiales post operatorio</li>
                  <li>Cuidados especiales en el hogar</li>
                </ul>
               </>
    },
    {
      summary: "Documentos a presentar",
      details: <>
                <b>Para la hospitalización en nuestra clínica, es necesario presentar los siguientes documentos:</b>
                <ul>
                  <li>Orden médica y consentimiento informado, entregado por su Médico tratante.</li>
                  <li>Cédula de identidad o pasaporte vigente.</li>
                  <li>Exámenes pre-operatorios.</li>
                </ul>
              </>
    },
  ]

  return (
    <Box m="20px">
      {rules.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMore/>}>
            <Typography variant="h4">
            {item.summary}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {item.details}
          </AccordionDetails>
      </Accordion>
      ))}        
    </Box>
  )
}

export default AdmissionRules