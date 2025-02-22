import React, { useEffect, useState } from "react";
import { Box, Card, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Tooltip, Collapse, CardHeader, Avatar, Grid2, Link } from "@mui/material";
import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined, SearchOutlined } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../../provider/AuthProvider";

const ServicePacks = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [responsedata, setresponsedata] = useState([])
  const [ts, setTargetService] = useState(null)

  const { token } = useAuth();

  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  const cardStyle = {
    padding: "20px",
    margin: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    flex: 1,
    minWidth: "300px"
  }

  const route = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {fetchAllPacks()}, [])

  const fetchAllPacks = async () => {

    setLoading(true)

    axios
      .get(`${route}/paquete_servicio/traer`,{
        headers: { Authorization: "Bearer "+token }
      })
      .then(response => {
        setresponsedata(response.data)
      })
      .catch((error) => { 
        setSnackbar({
          open: true,
          message: "Error al pedir datos",
          severity: "error"
        });
      })
      .finally(setLoading(false))
  }

  const displayData = (target) => {
  // Limpia el target service antes de cambiar el pack
    setTargetService(null)
    setSelectedPack(target);

  }

  const handleFetch = () => {
    setLoading(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 3 }}>
      <Header title="Paquetes" subtitle="Información de paquetes de servicios y sus requeridores" />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Card sx={cardStyle}>
          <Typography variant="h5" gutterBottom>Cédula de Requeridor</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ingrese la cédula del requeridor"
              variant="outlined"
              value=""
            />
          </Box>
          <Button sx={{mt: 2, mr:2}} variant="contained" onClick={handleFetch} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SearchOutlined />}>
               Buscar por requeridor
          </Button>
          <Button sx={{mt: 2}} variant="contained" color="info" onClick={fetchAllPacks} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SearchOutlined />}>
              Traer todos los paquetes
          </Button>
        </Card>

        <Card sx={cardStyle}>
          <Typography variant="h5" gutterBottom>Detalles</Typography>
          {selectedPack ? (
            <Box>
              <Typography><b>ID paquete:</b> {selectedPack.codigo_paquete}</Typography>
              <Typography><b>Nombre de requeridor:</b>dummy</Typography>
{/*           <Typography><b>Fecha Creación:</b> {}</Typography> */}
              <Typography><b>Monto total:</b> $ {selectedPack.precioPaquete}</Typography>    
{/*           <Typography><b>¿Pagado?:</b> {}</Typography>       */}
              <Typography><b>Consultas realizadas:</b> </Typography>
              <ul>
                {selectedPack.consultas.map((consul, index) => (                        
                                                                            // Para que mas abajo se reconociera a "ts" como que existe, tuve que dejar el target como index+1 
                  <li key={index}><Link component="button" underline="hover" onClick={() =>  setTargetService(index+1)}>{consul.servicio.nombre} para la fecha {consul.fechaTurno}</Link></li>
                ))}
              </ul>
            </Box>
          ) : (
            <Typography color="textSecondary">No se ha seleccionado un paquete</Typography>
          )}
        </Card>
      </Box>
      
      <Collapse orientation="vertical" in={ts ? true : false}>
        {/* Al parecer ts=0 es lo mismo que ts=null, por lo tanto no mostraba nada si no era por lo menos ts=1 */}
      {ts && selectedPack ? ( 
        <Card 
          sx={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            flex: 1,
            minWidth: "300px"}}
        >
          <CardHeader
            avatar={<Avatar src="/juntosalud_mini.png" aria-label="recipe"></Avatar>}
            action={<Typography variant="h6" mr={2} color="textSecondary" gutterBottom>00/00/00</Typography>} 
            title={<Typography variant="h3" gutterBottom>Clínica JuntoSalud</Typography>}
          
          />
          <Grid2 container m={2} p={2}>
            <Grid2 size={6}>
                {/* La idea era dejar que ts controlara el indice de consulta que debia traer, pero el problema anterior me obligo a tomar una solucion menos elegante  */}
              <Typography variant="h5" gutterBottom><b>Médico asignado:</b> {selectedPack.consultas[ts-1].medico.nombre} {selectedPack.consultas[ts-1].medico.apellido}</Typography>
              <Typography variant="h5" gutterBottom><b>Especialidad médico:</b> {selectedPack.consultas[ts-1].medico.especialidadMedica} </Typography>
              <Typography variant="h5" gutterBottom><b>Cédula medico:</b> {selectedPack.consultas[ts-1].medico.dni}</Typography>
              <Typography variant="h5" gutterBottom><b>Fecha asignada:</b> {selectedPack.consultas[ts-1].fechaTurno}</Typography>
              <Typography variant="h5" gutterBottom><b>Hora asignada:</b> {selectedPack.consultas[ts-1].horaTurno}</Typography>
            </Grid2>
            <Grid2 size={6}>
              <Typography variant="h5" gutterBottom><b>Paciente a tratar:</b> {selectedPack.consultas[ts-1].paciente.nombre} {selectedPack.consultas[ts-1].paciente.apellido}</Typography>
              <Typography variant="h5" gutterBottom><b>Género al nacer:</b> dummy</Typography>
              <Typography variant="h5" gutterBottom><b>Cédula paciente:</b> {selectedPack.consultas[ts-1].paciente.dni}</Typography>
              <Typography variant="h5" gutterBottom><b>Fecha de nacimiento:</b> {selectedPack.consultas[ts-1].paciente.fechaNac}</Typography>
              <Typography variant="h5" gutterBottom><b>Contacto:</b> {selectedPack.consultas[ts-1].paciente.telefono}</Typography>
              <Typography variant="h5" gutterBottom><b>Correo:</b> {selectedPack.consultas[ts-1].paciente.email}</Typography>
              <Typography variant="h5" gutterBottom><b>Dirección:</b> {selectedPack.consultas[ts-1].paciente.direccion}</Typography>
            </Grid2>
            <Grid2 size={12}>
              <Typography variant="h5" gutterBottom><b>Servicio requerido:</b> {selectedPack.consultas[ts-1].servicio.nombre}</Typography>
              <Typography variant="h5" gutterBottom><b>Descripcion del servicio:</b> {selectedPack.consultas[ts-1].servicio.descripcion}</Typography>
              <Typography variant="h5" gutterBottom><b>Precio original del servicio:</b> {selectedPack.consultas[ts-1].servicio.precio}</Typography>
              <Typography variant="h5" gutterBottom><b>Duración esperada del servicio:</b> {selectedPack.consultas[ts-1].servicio.duracion}</Typography>
              <Typography mt={5} variant="h4" gutterBottom><b>Pagado:</b> dummy</Typography>
            </Grid2>
          </Grid2>
        </Card> 
      ) : null}
      </Collapse>

      <Card sx={cardStyle}>
        <Typography variant="h5" gutterBottom>Paquetes</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>ID</TableCell>
                <TableCell>Nombre requeridor</TableCell>
        {/*     <TableCell>Fecha creación</TableCell>  */}
                <TableCell>Monto total</TableCell>     
        {/*     <TableCell>¿Pagado?</TableCell>        */} 
            <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responsedata.length > 0 && responsedata.map((pack, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                >
                  <TableCell>{pack.codigo_paquete}</TableCell>
                  <TableCell>dummy</TableCell>
                  {/* Para fecha de creacion, monto total y si es pagado o no */}
             {/*     <TableCell>{}</TableCell> */}
                     <TableCell>$ {pack.precioPaquete}</TableCell> 
             {/*     <TableCell>{}</TableCell> */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Inspeccionar">
                        <Button size="small" variant="outlined" onClick={() => displayData(pack)} ><SearchOutlined /></Button>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <Button variant="outlined" color="warning" size="small" ><EditOutlined/> </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <Button variant="outlined" color="error"  size="small" ><DeleteOutlineOutlined/> </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
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
    </Box>
  );
};

export default ServicePacks;