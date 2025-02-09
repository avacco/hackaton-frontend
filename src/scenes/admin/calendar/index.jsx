import { useState } from "react"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { formatDate } from "@fullcalendar/core" 
import listPlugin from "@fullcalendar/list";
import interactionPlugin from '@fullcalendar/interaction'
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material"
import Header from "../../../components/Header"
import { tokens } from "../../../theme"
import esLocale from '@fullcalendar/core/locales/es';

export default function Calendar() {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const route = import.meta.env.VITE_API_ROUTE;
  
  const handleDateClick = (selected) => {
    const title = prompt("Ingresa un titulo para el evento")
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if(title){ 
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allday: selected.allDay
      })
    }
  }

  const handleEventClick = (selected) => {
    if (window.confirm(`¿Eliminar ${selected.event.title}?`)){
      selected.event.remove()
    }
  }


  return (
    <Box m="20px">
      <Header title="Calendario" subtitle="Vista de turnos en calendario" />
      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 20%" backgroundColor={colors.primary[400]} p="15px" borderRadius="4px">
          <Typography variant="h5">
            Turnos
          </Typography>
          <List>
            {currentEvents.map((turn) => (
              <ListItem 
              key={turn.id} 
              sx={{ backgroundColor: colors.primary[900], margin: "10px 0", borderRadius: "2px"}}
              >
                <ListItemText 
                primary={
                  <Typography fontWeight="bold">
                    {turn.title} 
                  </Typography>}
                secondary={
                  <Typography fontWeight="bold">
                    {formatDate(turn.start, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                  } 
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar 
          height="75vh"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin
          ]}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth"
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventClick={handleEventClick}
          eventsSet={(events) => setCurrentEvents(events)} 
          initialEvents={[
            {id: "1234", title: "Todo el dia", date: "2025-01-02"}
          ]}
          locale={esLocale}   
          />
        </Box>
      </Box>
    </Box>

  )
}
