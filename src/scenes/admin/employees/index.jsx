import { Box, Button, Stack, Typography, useTheme } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../../theme"
import { esES } from '@mui/x-data-grid/locales';
import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";

export default function Employees() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();
  const { setToken } = useAuth();
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
          // limpia el token si hay un error 401, el cual solo deberia ser ocasionado por expiracion del token
          // en teoria, tambien tirará error 401 si se intenta acceder a recursos prohibidos, pero esto no deberia suceder una vez se oculten los recursos por roles
          // y si lo hace, es porque se estuvo manipulando el codigo de alguna manera, y si es asi, se merece que lo tiren de todos modos.
          if(error.response.status === 401)
          setToken();
          location.reload();
        })
  }, [])
  
  
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
      field: "fecha_nac", 
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
      field: "especialidad_medica", 
      headerName: "Especialidad", 
      flex: 1
    },
    {
      field: "actions", 
      headerName: "Acciones", 
      flex: 1, 
      renderCell: () => { 
        return ( 
          <Stack direction="row" spacing={1} mt="15px">
            <Button variant="outlined" color="warning" size="small" ><EditOutlined/> Editar</Button>
            <Button variant="outlined" color="error"  size="small"><DeleteOutlineOutlined/> Eliminar</Button>
          </Stack>
        ) 
      },
    },
  ];
  
  return (
    <Box m="20px">
      <Header title="Empleados" subtitle="Lista de empleados" />
      <Box m="40px 0 0 0" height="75vh" sx={{
         "& .MuiDataGrid-root ": {border: "none"},
         "& .MuiDataGrid-cell": {borderBottom: "none"},
         "& .name-column-cell": {color: colors.greenAccent[300]},
         "& .MuiDataGrid-columnHeader": {backgroundColor: colors.blueAccent[700] , borderBottom: "none"},
         "& .MuiDataGrid-virtualScroller": {backgroundColor: colors.primary[400]},
         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {color: `${colors.grey[100]} !important`},
         "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700]} }}> 
        <DataGrid 
        getRowId={(row) => row.id_persona}
        rows={ responsedata }
        columns={ columns } 
        slots={{toolbar: GridToolbar}}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText} />
      </Box>
    </Box>
  )
}
