import { Alert, Box, Button, Card, CircularProgress, InputAdornment, Snackbar, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { AttachMoneyOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

export default function ServicesForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { token } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;
 
  // Valores iniciales para campos de formulario

  const [initialValues, setInitialValues] = useState(
    {
      codigo_servicio: "",
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
    }
  ) 

  // Define la logica de validacion para los campos
  const serviceSchema = yup.object().shape({
    nombre: yup.string().required("Requerido"),
    descripcion: yup.string().required("Requerido"),
    precio: yup.number().typeError("Debe ser un valor numérico").required("Requerido"),
    duracion: yup.string().matches(/^[0-9]{1,2}:[0-9]{2}$/, "Formato incorrecto").required("Requerido")
  })

  const [loading, setLoading] = useState(false);
  
  // Popups para exito y fracaso en login
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  // Presionar en editar en la tabla de servicios redirige aqui y trae consigo el ID del servicio a editar.
  // Si existe un ID, se carga la informacion del servicio en el formulario.
  const { state } = useLocation();

  useEffect(() => {
    if(state) {

      axios
        .get(`${route}/servicio_medico/traer/${state}`,{
           headers: { Authorization: "Bearer "+token }
          },)
        .then(response => {
          setInitialValues(response.data)
        },
      )

    }
  }, [state])
  


  const handleFormSubmit = async (values) => {
    setLoading(true)
    console.log(values)
    await axios 
              .post(`${route}/servicio_medico/crear`, values, {
                headers: { Authorization: "Bearer "+token }
              },)
              .then((response) => {
                  setSnackbar({
                    open: true,
                    message: state ? "Servicio editado" : "Servicio creado",
                    severity: "success"
                  });
                  setLoading(false)
                

            }).catch((error) => {
                setSnackbar({
                  open: true,
                  message: "Error al intentar crear servicio.",
                  severity: "error"
                });
                setLoading(false)
            })
  };

  return (
    <Box m="20px">
      <Header title="Crear nuevo servicio" subtitle="Formulario de servicios" />
      <Card sx={{pb:4, pt:2, px:2, m:2}}>
      <Typography variant="h4" color="green" mb={4}>Datos</Typography>
      <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={serviceSchema}
        enableReinitialize
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
                                          {/* Con este pedazo de codigo puedo usar span 1-4 para dividir en cuatro columnas el espacio de la caja. */}
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0,1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}}}>
            <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="ID"
                value={values.codigo_servicio}
                name="codigo_servicio"
                sx={{ gridColumn: "span 4", display:"none" }}
                disabled
             />
            <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Nombre de servicio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre} 
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 4" }}
             />
             <TextField 
                fullWidth
                multiline
                rows={4}
                variant="filled"
                type="text"
                label="Descripcion"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.descripcion}
                name="descripcion"
                error={!!touched.descripcion && !!errors.descripcion} 
                helperText={touched.descripcion && errors.descripcion}
                sx={{ gridColumn: "span 4" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Precio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.precio}
                name="precio"
                error={!!touched.precio && !!errors.precio} 
                helperText={touched.precio && errors.precio}
                slotProps={{
                  input: {
                    startAdornment: 
                    <InputAdornment position="start">
                      <AttachMoneyOutlined fontSize="10" />
                    </InputAdornment>
                  }
                }}
                sx={{ gridColumn: "span 2" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Duración"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.duracion}
                placeholder="Duracion en horas:minutos (ejemplo: 02:30)"
                name="duracion"
                error={!!touched.duracion && !!errors.duracion} 
                helperText={touched.duracion && errors.duracion}
                sx={{ gridColumn: "span 2" }}
             />             

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Crear servicio"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
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
  )
}
