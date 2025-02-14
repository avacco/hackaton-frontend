import { Alert, Box, Button, Snackbar, Stack } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { esES } from '@mui/x-data-grid/locales';
import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Services() {

  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();

  const navigate = useNavigate();

  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  const route = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
    axios
        .get(`${route}/servicio_medico/traer`,{
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
  }, [])
  
  const handleDelete = async (id) => {
    await axios
      .delete(`${route}/servicio_medico/borrar/${id}`, {
        headers: { Authorization: "Bearer "+token }})
        .then(response => {
          setSnackbar({
            open: true,
            message: "Servicio eliminado",
            severity: "success"
          });
          setresponsedata(responsedata.filter((row) => row.codigo_servicio !== id))
        })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Error al eliminar",
          severity: "error"
        });
      })
  }
  
  // Control de columnas, el field corresponde al nombre de dato al que correspondera la columna
  // Todos los demas parametros son para modificar aspectos de la columna, como el nombre, alineamiento, clases, etc.
  const columns = [
    {
      field: "codigo_servicio", 
      headerName: "ID"
    },
    {
      field: "nombre", 
      headerName: "Nombre servicio", 
      flex: 0.7, 
      cellClassName: "name-column--cell" // Define un nombre de clase para usar mas adelante
    },
    {
      field: "descripcion", 
      headerName: "Descripcion", 
      flex: 3, 
    },
    {
      field: "precio", 
      headerName: "Precio", 
      flex: 0.5
    },
    {
      field: "duracion", 
      headerName: "Duracion servicio", 
      flex: 0.5
    },
    {
      field: "actions", 
      headerName: "Acciones", 
      flex: 1, 
      renderCell: ({ row: { codigo_servicio }}) => { 
        return ( 
          <Stack direction="row" spacing={1} mt="15px">
            <Button variant="outlined" color="warning" size="small" onClick={ ()=> navigate("/system/serviceform", { state: codigo_servicio})} ><EditOutlined /> </Button>
            <Button variant="outlined" color="error"  size="small" onClick={ () => handleDelete(codigo_servicio) }><DeleteOutlineOutlined /> </Button>
          </Stack>
        ) 
      },
    },
  ];
  
  return (
    <Box m="20px">
      <Header title="Servicios" subtitle="Lista de servicios" />
      <Box m="40px 0 0 0" height="75vh" sx={{
         "& .MuiDataGrid-root ": {border: "none"},
         "& .MuiDataGrid-cell": {borderBottom: "none"},
         "& .name-column-cell": {},
         "& .MuiDataGrid-columnHeader": { borderBottom: "none"},
         "& .MuiDataGrid-virtualScroller": {},
         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
         "& .MuiDataGrid-footerContainer": { borderTop: "none"} }}> 
        <DataGrid 
        getRowId={(row) => row.codigo_servicio}
        rows={ responsedata }
        columns={columns} 
        slots={{toolbar: GridToolbar}}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText} />
      </Box>
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
  )
}
