import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { Typography } from "@mui/material";
import dayjs from "dayjs";

const Calendar = () => {

  // Controla los dias que deben ser habilitados. Por defecto estan todos deshabilitados.
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const today = dayjs().startOf("day");
  const lastEnabledDate = today.add(4, "day");
  
  // Define las fechas que estaran habilitadas. Esto debe ser conectado a una api para traer los turnos y horarios de los doctores.
  const shouldDisableDate = (date) => {
    const currentDate = dayjs(date);
    return currentDate.isBefore(today) || currentDate.isAfter(lastEnabledDate);
  };

  // Muestra en consola la fecha seleccionada. Esto sera usado para enviar por api mas adelante.
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    console.log(`Fecha seleccionada: ${newDate.format("DD/MM/YYYY")}`); 
  };

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Días disponibles
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          disablePast
        />
      </LocalizationProvider>
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2 }}>
        Solo los dias disponibles pueden ser seleccionados
      </Typography>
    </>
  );
};

export default Calendar;