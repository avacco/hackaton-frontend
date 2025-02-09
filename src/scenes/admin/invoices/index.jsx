import { Box, Button, Stack, Typography, useTheme } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../../theme"
import { esES } from '@mui/x-data-grid/locales';

import Header from "../../../components/Header";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthProvider";
import axios from "axios";

export default function Invoices() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const route = import.meta.env.VITE_API_ROUTE;
  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();
  const { setToken } = useAuth();


  useEffect(() => {
    axios
        .get(`${route}/factura/traer`,{
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
      field: "numeroFactura", 
      headerName: "ID"
    },
    {
      field: "fechaEmision", 
      headerName: "Fecha de emisión", 
      flex: 1, 
      cellClassName: "name-column--cell" // Define un nombre de clase para usar mas adelante
    },
    {
      field: "fechaVencimiento", 
      headerName: "Fecha de vencimiento", 
      flex: 1
    },
    {
      field: "montoTotal", 
      headerName: "Monto total", 
      flex: 1,
      renderCell: (params) => { 
        return (
          <Typography mt="15px" color={colors.greenAccent[500]}>
            ${params.row.montoTotal}
          </Typography>
        )
      }
    },
    {
      field: "moneda", 
      headerName: "Moneda", 
      flex: 1
    },
    {
      field: "formaPago", 
      headerName: "Forma de pago", 
      flex: 1
    },
    {
      field: "estado", 
      headerName: "Estado", 
      flex: 1
    },
    {
      field: "descuento", 
      headerName: "Descuento", 
      flex: 1
    },
    {
      field: "iva", 
      headerName: "IVA", 
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
      <Header title="Facturas" subtitle="Lista de facturas por servicios" />
      <Box m="40px 0 0 0" height="75vh" sx={{
         "& .MuiDataGrid-root ": {border: "none"},
         "& .MuiDataGrid-cell": {borderBottom: "none"},
         "& .name-column-cell": {color: colors.greenAccent[300]},
         "& .MuiDataGrid-columnHeader": {backgroundColor: colors.blueAccent[700] , borderBottom: "none"},
         "& .MuiDataGrid-virtualScroller": {backgroundColor: colors.primary[400]},
         "& .MuiDataGrid-toolbarContainer .MuiButton-text": {color: `${colors.grey[100]} !important`},
         "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700]} }}> 
        <DataGrid 
        rows={ responsedata }
        columns={ columns } 
        slots={{toolbar: GridToolbar}}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
        />
      </Box>
    </Box>
  )
}
