import React, { useEffect, useState } from "react";
import { Box, Card, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Tooltip } from "@mui/material";
import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined, SearchOutlined } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../../provider/AuthProvider";

const ServicePacks = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [responsedata, setresponsedata] = useState([])

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
    margin: "20px",
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
    console.log(target);

    setSelectedPack(target);

  }

  const handleFetch = () => {
    setLoading(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 3 }}>
      <Header title="Paquetes" subtitle="Información de paquetes de servicios y sus requeridores" />
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={cardStyle}>
          <Typography variant="h5" gutterBottom>Cédula de Paciente</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ingrese la cédula del paciente"
              variant="outlined"
              value=""
            />
          </Box>
          <Button sx={{mt: 2}} variant="contained" onClick={handleFetch} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SearchOutlined />}>
               Buscar por paciente
          </Button>
          <Button sx={{mt: 2, ml: 2}} variant="contained" color="info" onClick={fetchAllPacks} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SearchOutlined />}>
              Traer todos los paquetes
          </Button>
        </Card>

        <Card sx={cardStyle}>
          <Typography variant="h5" gutterBottom>Detalles</Typography>
          {selectedPack ? (
            <Box>
              <Typography><b>ID:</b> {selectedPack.id_sp}</Typography>
              <Typography><b>Nombre Paciente:</b> {selectedPack.consultas[0].paciente.nombre} {selectedPack.consultas[0].paciente.apellido}</Typography>
{/*           <Typography><b>Fecha Creación:</b> {}</Typography> */}
{/*           <Typography><b>Monto total:</b> {}</Typography>    */}
{/*           <Typography><b>¿Pagado?:</b> {}</Typography>       */}
              <Typography><b>Consultas realizadas:</b> </Typography>
              <ul>
                {selectedPack.consultas.map((consul, index) => (
                  <li key={index}>Sere una consulta clickeable</li>
                ))}
              </ul>
            </Box>
          ) : (
            <Typography color="textSecondary">No se ha seleccionado un paquete</Typography>
          )}
        </Card>
      </Box>

      <Card sx={cardStyle}>
        <Typography variant="h5" gutterBottom>Paquetes</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>ID</TableCell>
                <TableCell>Nombre paciente</TableCell>
        {/*     <TableCell>Fecha creación</TableCell>  */}
        {/*     <TableCell>Monto total</TableCell>     */} 
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
                  <TableCell>{pack.id_sp}</TableCell>
                  <TableCell>{pack.consultas[index].paciente.nombre} {pack.consultas[index].paciente.apellido}</TableCell>
                  {/* Para fecha de creacion, monto total y si es pagado o no */}
             {/*     <TableCell>{}</TableCell> */}
             {/*     <TableCell>{}</TableCell> */}
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