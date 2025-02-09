import { Box, Button, Stack, Typography } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"

import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { esES } from '@mui/x-data-grid/locales';
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import axios from "axios";

export default function Patients() {

  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();
  const { setToken } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
    axios
        .get(`${route}/paciente/traer`,{
          headers: { Authorization: "Bearer "+token }
        })
        .then(response => {
          setresponsedata(response.data)
        })
        .catch((error) => { 
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
      field: "obra_social", 
      headerName: "Obra social", 
      flex: 1,
      renderCell: ({row: {obra_social}}) => { 
        return ( 
        <>
          {obra_social === true && <Typography pt="16px" color="si">Si</Typography>}
          {obra_social === false && <Typography pt="16px" color="red">No</Typography>}
        </>
        ) 
      },
    },
    {
      field: "actions", 
      headerName: "Acciones", 
      flex: 1, 
      renderCell: () => { 
        return ( 
          <Stack direction="row" spacing={1} mt="15px">
            <Button variant="outlined" color="warning" size="small" ><EditOutlined/> </Button>
            <Button variant="outlined" color="error"  size="small"><DeleteOutlineOutlined/> </Button>
          </Stack>
        ) 
      },
    },
  ];
  
  return (
    <Box m="20px">
      <Header title="Pacientes" subtitle="Lista de pacientes" />
      <Box m="40px 0 0 0" height="75vh" sx={{
         "& .MuiDataGrid-root ": {border: "none"},
         "& .MuiDataGrid-cell": {borderBottom: "none"},
         "& .name-column-cell": {},
         "& .MuiDataGrid-columnHeader": {borderBottom: "none"},
         "& .MuiDataGrid-virtualScroller": {},     
         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {},
         "& .MuiDataGrid-footerContainer": { borderTop: "none"} }}>
        <DataGrid 
        getRowId={(row) => row.id_persona}
        rows={ responsedata }
        columns={ columns } 
        slots={{toolbar: GridToolbar}} 
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}/>
      </Box>
    </Box>
  )
}
