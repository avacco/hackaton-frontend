import { Alert, Box, Button, ButtonGroup, Card, Checkbox, FormControlLabel, Grid2, Snackbar, Typography } from '@mui/material'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

function WorkDaySetter({ workweek, setWorkweek, lastStep, setlastStep, state  }) {

    const [dayNumber, setDayNumber] = useState(1)

      // Para botones de dia de la semana. Si es un edit, setea como terminado, sino default a monday.
    const [selectedDay, setSelectedDay] = useState(state ? "TERMINADO" : "MONDAY")

    // Para setear hora de inicio y finalizacion de jornada, horas de descanso y si es un dia laboral.
    const [startHour, setStartHour] = useState(dayjs().hour(8))
    const [finishHour, setfinishHour] = useState(dayjs().hour(8))
    const [isRestDay, setIsRestDay] = useState(false);
    const [startLunch, setStartLunch] = useState(dayjs().hour(8))
    const [finishLunch, setFinishLunch] = useState(dayjs().hour(8))
    const [workDayText, setWorkDayText] = useState(``)

    // Popups
    const [snackbar, setSnackbar] = useState(
      {
        open: false,
        message: "",
        severity: "success"
      }
    );

    // Para una iteracion mas adelante. Name es el nombre para los botones y send es lo que sera enviado
    const daysOfWeek = [
      {
        id: 0, name: "Lunes", send: "MONDAY"
      },
      {
        id: 1, name: "Martes", send: "TUESDAY"
      },
      {
        id: 2, name: "Miércoles", send: "WEDNESDAY"
      },
      {
        id: 3, name: "Jueves", send: "THURSDAY"
      },
      {
        id: 4, name: "Viernes", send: "FRIDAY"
      },
      {
        id: 5, name: "Sabado", send: "SATURDAY"
      },
      {
        id: 6, name: "Domingo", send: "SUNDAY"
      },
      {
        id: 6, name: "Terminado", send: "TERMINADO"
      },
    ]

    // Muestra la jornada laboral actual si esta ya fue establecida.
    useEffect(() => {
    if(workweek.find((workday) => workday.diaSemana === selectedDay)) { 
      setWorkDayText(`Jornada: ${workweek.find((workday) => workday.diaSemana === selectedDay).horaInicio} - ${workweek.find((workday) => workday.diaSemana === selectedDay).horaFinal} | Descanso: ${workweek.find((workday) => workday.diaSemana === selectedDay).horaInicioDescanso} - ${workweek.find((workday) => workday.diaSemana === selectedDay).horaFinalDescanso}`)
    } else { 
      setWorkDayText(``)
    }
    }, [selectedDay])
    

    const confirmWorkday = async () => {

      // Verifica que las horas sean validas.
      if (finishHour.isBefore(startHour) || finishLunch.isBefore(startLunch) || finishHour.isSame(startHour) || finishLunch.isSame(startLunch)) {
  
        setSnackbar({
          open: true,
          message: "Horas inválidas. Revisa que las horas de inicio sean anteriores a las de finalización.",
          severity: "error"
        });
  
        return
      }
  
      // Prepara el workday para ser añadido a la workweek
      let workDay = {
        id_turno : "",
        horaInicio: startHour.format("HH:mm"),
        horaFinal: finishHour.format("HH:mm"),
        horaInicioDescanso: startLunch.format("HH:mm"),
        horaFinalDescanso: finishLunch.format("HH:mm"),
        diaSemana: selectedDay,
        descanso: isRestDay,
        numeroDia: dayNumber
      }
  
      // Si se trata de un edit, conserva el ID del workday para poder actualizarlo en la lista.
      if(state) {
        workDay.id_turno = workweek.find((workday) => workday.diaSemana === selectedDay).id_turno
      }
  
      // Actualiza el workday si este ya existe en la lista, sino, lo añade.
      if (workweek.find((workday) => workday.diaSemana === selectedDay)) {
        let index = workweek.findIndex((workday) => workday.diaSemana === selectedDay)
        workweek[index] = workDay
      } else {
        setWorkweek([...workweek, workDay])
      }

      setSnackbar({
        open: true,
        message: "Jornada establecida",
        severity: "success"
      });   
  
    }

    
  const handleDaySelection = (day) => {
    setSelectedDay(day)
    setlastStep(false)
    
      switch (day) {
      case "MONDAY":
        setDayNumber(1)        
        break;
      
      case "TUESDAY":
        setDayNumber(2)        
        break;

      case "WEDNESDAY":
        setDayNumber(3)        
        break;

      case "THURSDAY":
        setDayNumber(4)        
        break;

      case "FRIDAY":
        setDayNumber(5)        
        break;

      case "SATURDAY":
        setDayNumber(6)        
        break;

      case "SUNDAY":
        setDayNumber(7)
        break;
      
      case "TERMINADO":
        setlastStep(true)
        break;
    
      default:
        break;
    }
  }


  
  return (

    <Card sx={{p:2, m:2}}>
      <Typography variant="h4" color="green"> Jornada laboral</Typography>
      <ButtonGroup sx={{mb:10, mt:4}} variant="contained">
      {daysOfWeek.map((item) => (
        <Button 
          onClick={() => handleDaySelection(item.send)}
          key={item.id} 
          variant={selectedDay === item.send ? "contained" : "text"}
          disabled={item.send === "TERMINADO" && workweek.length < 7 ? true : false}
        >
          {item.name} { workweek.find((workday) => workday.diaSemana === item.send) ? "✓" : "" } {/* Si el dia de la semana ya fue establecido, muestra un check */}
        </Button>
      ))}
      </ButtonGroup>
      <Box>
        <Button disabled={lastStep} sx={{mb:2, mr:2}} variant="contained" onClick={confirmWorkday}>Confirmar jornada</Button>
        {workDayText}
      </Box>
      <Box>
      <FormControlLabel sx={{ml:3}} control={<Checkbox checked={isRestDay} onClick={() => setIsRestDay(!isRestDay)} />} label="Dia de descanso" />
      </Box>
      <Grid2 container>
        <Grid2 size={6}>
          <Card sx={{mx:2}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h4" align="center" gutterBottom>
              Hora de entrada
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              Seleccione una hora
            </Typography>
            <DigitalClock 
              sx={{scrollbarWidth:'none', ml:2}} 
              ampm={false} 
              minTime={dayjs().hour(7).minute(30)}
              maxTime={dayjs().hour(20).minute(0)}
              onChange={setStartHour}
            />
          </LocalizationProvider>
          </Card>
        </Grid2>
        <Grid2 size={6}>
          <Card sx={{mx:2}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h4" align="center" gutterBottom>
              Hora de salida
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              Seleccione una hora
            </Typography>
            <DigitalClock 
              sx={{scrollbarWidth:'none', ml:2}}
              ampm={false} 
              minTime={startHour.add(30,"minutes")}
              maxTime={dayjs().hour(20).minute(0)}
              onChange={setfinishHour}
            />
          </LocalizationProvider>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 size={6}>
          <Card sx={{mx:2, mt:4}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Typography variant="h4" align="center" gutterBottom>
                Inicio de almuerzo
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                Seleccione una hora
              </Typography>
              <DigitalClock 
                sx={{scrollbarWidth:'none', ml:2}} 
                ampm={false} 
                minTime={dayjs().hour(7).minute(30)}
                maxTime={dayjs().hour(20).minute(0)}
                onChange={setStartLunch}
              />
            </LocalizationProvider>
          </Card>
        </Grid2>

        <Grid2 size={6}>
          <Card sx={{mx:2, mt:4}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Typography variant="h4" align="center" gutterBottom>
                Término de almuerzo
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                Seleccione una hora
              </Typography>
              <DigitalClock 
                sx={{scrollbarWidth:'none', ml:2}}
                ampm={false} 
                minTime={startHour.add(30,"minutes")}
                maxTime={dayjs().hour(20).minute(0)}
                onChange={setFinishLunch}
              />
            </LocalizationProvider>
          </Card>
        </Grid2>
      </Grid2>      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>

  )
}

export default WorkDaySetter