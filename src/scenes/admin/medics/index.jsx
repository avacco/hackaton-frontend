import { Alert, Box, Button, Snackbar, Stack } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { esES } from '@mui/x-data-grid/locales';
import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Employees() {

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
        .get(`${route}/medico/traer`,{
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
      .delete(`${route}/medico/borrar/${id}`, {
        headers: { Authorization: "Bearer "+token }})
        .then(response => {
          setSnackbar({
            open: true,
            message: "Médico eliminado",
            severity: "success"
          });
          setresponsedata(responsedata.filter((row) => row.id_persona !== id))
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
      field: "id_persona", 
      headerName: "ID"
    },
    {
      field: "nombre", 
      headerName: "Nombre", 
      flex: 1, 
      cellClassName: "name-column--cell" // Define un nombre de clase para usar mas adelante
    },
    {
      field: "apellido", 
      headerName: "Apellido", 
      flex: 1, 
    },
    {
      field: "dni", 
      headerName: "Cedula", 
      flex: 1
    },
    {
      field: "fechaNac", 
      headerName: "Fecha de nacimiento", 
      flex: 1
    },
    {
      field: "email", 
      headerName: "Correo", 
      flex: 1
    },
    {
      field: "telefono", 
      headerName: "Telefono", 
      flex: 1
    },
    {
      field: "direccion", 
      headerName: "Direccion", 
      flex: 1
    },
    {
      field: "sueldo", 
      headerName: "Sueldo", 
      flex: 1
    },
    {
      field: "especialidadMedica", 
      headerName: "Especialidad", 
      flex: 1
    },
    {
      field: "actions", 
      headerName: "Acciones", 
      flex: 1, 
      renderCell: ({ row: { id_persona }}) => { 
        return ( 
          <Stack direction="row" spacing={1} mt="15px">
            <Button variant="outlined" color="warning" size="small" onClick={ () => navigate("/system/form", { state: id_persona })} ><EditOutlined/> </Button>
            <Button variant="outlined" color="error"  size="small" onClick={ () => handleDelete(id_persona) }><DeleteOutlineOutlined/> </Button>
          </Stack>
        ) 
      },
    },
  ];
  
  return (
    <Box m="20px">
      <Header title="Médicos" subtitle="Lista de médicos registrados" />
      <Box m="40px 0 0 0" height="75vh" sx={{
         "& .MuiDataGrid-root ": {border: "none"},
         "& .MuiDataGrid-cell": {borderBottom: "none"},
         "& .name-column-cell": {},
         "& .MuiDataGrid-columnHeader": { borderBottom: "none"},
         "& .MuiDataGrid-virtualScroller": {},
         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
         "& .MuiDataGrid-footerContainer": { borderTop: "none"} }}> 
        <DataGrid 
        getRowId={(row) => row.id_persona}
        rows={ responsedata }
        columns={ columns } 
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
