import { Box, Typography } from '@mui/material'
import React from 'react'

const Surgery = () => {
  return (
    <Box>
      <Typography variant='h4'> Estimado paciente</Typography>
      <Typography variant='h5'> Estamos listos para ayudarte a resolver tu problema de salud. Para poder llevar a cabo tu procedimiento quirúrgico, debes cumplir con lo siguiente y así evitaras que se suspenda tu cirugía:</Typography>
      <ol>
        <li><Typography variant='h5' mb={1}>Trae todos tus exámenes más recientes, sanguíneos, imágenes de rayos, electrocardiogramas que tengas y si cuentas con un pase de otro médico, debes traerlo también.</Typography></li>
        <li><Typography variant='h5' mb={1}>Preséntate el día de tu cirugía, 3-4 horas antes de tu procedimiento en admisión, con tu cédula de identidad y tu orden de hospitalización.</Typography></li>
        <li><Typography variant='h5' mb={1}>Debes respetar <b>8 horas de ayuno estricto</b> antes del horario de tu cirugía, esto significa que no puedes comer nada ni beber agua, a menos que tu médico te indique lo contrario.</Typography></li>
        <li><Typography variant='h5' mb={1}>Toma tus medicamentos de uso habitual, de acuerdo con la indicación de tu médico. En el caso que tenga que tomar algún medicamento antes de la cirugía, tómatelo con una pequeña cantidad de agua.</Typography></li>
        <li><Typography variant='h5' mb={1}>Si tomas algún medicamento anticoagulante, tu médico indicará si lo debes suspender días antes del procedimiento<b>, lo importante es que informes qué medicamentos tomas</b></Typography></li>
        <li><Typography variant='h5' mb={1}>NO tomes Aspirina al menos 5 días antes de su cirugía</Typography></li>
        <li><Typography variant='h5' mb={1}>Es importante informar alergias.</Typography></li>
        <li><Typography variant='h5' mb={1}>Si utiliza piezas removibles en su boca y / o lentes de contacto, por favor notifíquelo y traiga una caja para guardarlo.</Typography></li>
        <li><Typography variant='h5' mb={1}>Uñas sin esmalte, no vengas con maquillaje. No utilice joyería o piercings Todo esto no se permitirá en tu ingreso al quirófano.</Typography></li>
        <li><Typography variant='h5' mb={1}>Debes acudir bañado el día de tu cirugía, realiza una ducha, que incluya el cabello la noche anterior y la mañana de la cirugía. Del mismo modo, realizar un correcto cepillado y enjuague de dientes.</Typography></li>
        <li><Typography variant='h5' mb={1}>No rasures el vello de tu piel previo a la cirugía ni te apliques cremas corporales.</Typography></li>
        <li><Typography variant='h5' mb={1}>Suspende el consumo de las siguientes sustancias adictivas a lo menos una semana antes de la cirugía:</Typography>
        <ul>
          <li ><Typography variant='h5'>Cigarros</Typography></li>
          <li ><Typography variant='h5'>Drogas ilícitas</Typography></li>
          <li ><Typography variant='h5'>Alcohol</Typography></li>
          <li ><Typography variant='h5'>Bebidas energéticas</Typography></li>
        </ul>
        </li>
        <li ><Typography variant='h5' mt={1}>Trae un bolso con tus útiles personales y una muda de ropa cómoda.</Typography></li>
      </ol>
    </Box>
  )
}

export default Surgery