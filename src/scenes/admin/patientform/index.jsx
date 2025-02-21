import { Alert, Box, Button, Card, Checkbox, CircularProgress, FormControlLabel, Snackbar, TextField, Typography } from "@mui/material"
import { Field, Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";  

export default function PatientForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { token } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;

  const [obraSocial, setObraSocial] = useState(false) 
 
  // Valores iniciales para campos de formulario
  const [initialValues, setInitialValues] = useState({
    id_persona: "",
    nombre: "Mauricio",
    apellido: "Velasquez",
    dni: "786746234",
    fechaNac: "2011-10-01",
    email: "correo@hotmail.com",
    telefono: "777212312",
    direccion: "Pasaje Pintores 321",
    obraSocial: true,
  });

  // Define la logica de validacion para los campos
  const userSchema = yup.object().shape({
    nombre: yup.string().required("Requerido"),
    apellido: yup.string().required("Requerido"),
    dni: yup.string().required("Requerido"),
    fechaNac: yup.date().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    telefono: yup.string().required("Requerido"),
    direccion: yup.string().required("Requerido"),
  })

  const [loading, setLoading] = useState(false);

  // Popups
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  // Presionar en editar en la tabla de administradores redirige aqui y trae consigo el ID del personal a editar.
  // Si existe un ID, se carga la informacion del personal en el formulario.
  const { state } = useLocation();

  useEffect(() => {
    if(state) {
      console.log(state)
      axios
        .get(`${route}/paciente/traer/${state}`)
        .then(response => {

          const data = response.data;

          setInitialValues({
            id_persona: data.id_persona,
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            fechaNac: data.fechaNac,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            obraSocial: data.obraSocial,
          })
        },
      )
    }
  }, [state])
  



  const handleFormSubmit = async (values) => {
    setLoading(true)
    console.log(values)
    await axios 
              .post(`${route}/paciente/crear`, values)
              .then((response) => {
                  setSnackbar({
                    open: true,
                    message: state ? "Datos de paciente editados" : "Paciente registrado",
                    severity: "success"
                  });         
            }).catch((error) => {
                setSnackbar({
                  open: true,
                  message: "Error al intentar registrar paciente.",
                  severity: "error"
                });
                console.log(error)
            }).finally(setLoading(false))

  };

  return (
    <Box m="20px">
      <Header title="Crear perfil de paciente" subtitle="Formulario de registro" />
      <Card sx={{pb:4, pt:2, px:2, m:2}}>
      <Typography variant="h4" color="green" mb={4}>Datos</Typography>
      <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={userSchema}
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
                value={values.id_persona}
                name="id_persona"
                sx={{ gridColumn: "span 4", display:"none" }}
                disabled
             />
            <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre} // !! convierte un no boolean a un boolean invertido. En este caso significa que firstName tanto en "touched" como en "errors", debe ser verdadero para mostrar el error.
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 2" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Apellido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellido}
                name="apellido"
                error={!!touched.apellido && !!errors.apellido} 
                helperText={touched.apellido && errors.apellido}
                sx={{ gridColumn: "span 2" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="DNI o Cedula de identidad"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dni}
                name="dni"
                error={!!touched.dni && !!errors.dni} 
                helperText={touched.dni && errors.dni}
                sx={{ gridColumn: "span 4" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de nacimiento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fechaNac}
                name="fechaNac"
                error={!!touched.fechaNac && !!errors.fechaNac} 
                helperText={touched.fechaNac && errors.fechaNac}
                sx={{ gridColumn: "span 4" }}
             />             
            <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Correo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email} 
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Contacto"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono}
                name="telefono"
                error={!!touched.telefono && !!errors.telefono} 
                helperText={touched.telefono && errors.telefono}
                sx={{ gridColumn: "span 2" }}
             />
             <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion} 
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 4" }}
             />
              <FormControlLabel 
                onChange={handleChange}
                name="obraSocial"
                control={<Checkbox checked={values.obraSocial} />} 
                label="¿Obra social?" 
              />  
            
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Registrar paciente"}
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
