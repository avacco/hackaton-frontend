import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useState } from "react";
import axios from "axios";

export default function AdminForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { token } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;
 
  // Valores iniciales para campos de formulario
  const initialValues = {
    nombre: "Andres",
    apellido: "Vargas",
    dni: "192538904",
    fechaNac: "1996-12-24",
    email: "fakeanon32123@gmail.com",
    telefono: "987167562",
    direccion: "Costanera del Estrecho 2729",
    username: "avargas",
    password: "andres12",
    rol: "admin",
  };

  // Define la logica de validacion para los campos
  const userSchema = yup.object().shape({
    nombre: yup.string().required("Requerido"),
    apellido: yup.string().required("Requerido"),
    dni: yup.string().required("Requerido"),
    fechaNac: yup.date().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    telefono: yup.string().required("Requerido"),
    direccion: yup.string().required("Requerido"),
    username: yup.string().required("Requerido"),
    password: yup.string("").required("Requerido"),
    rol: yup.string().required("Requerido"),
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


  const handleFormSubmit = async (values) => {
    setLoading(true)
    console.log(values)
    await axios 
              .post(`${route}/personal/crear`, values, {
                headers: { Authorization: "Bearer "+token }
              },)
              .then((response) => {
                  setSnackbar({
                    open: true,
                    message: "Personal administrativo añadido",
                    severity: "success"
                  });
                  setLoading(false)
                

            }).catch((error) => {
                setSnackbar({
                  open: true,
                  message: "Error al intentar crear personal.",
                  severity: "error"
                });
                setLoading(false)
            })
  };

  return (
    <Box m="20px">
      <Header title="Crear perfil de empleado" />
      <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
                                          {/* Con este pedazo de codigo puedo usar span 1-4 para dividir en cuatro columnas el espacio de la caja. */}
            <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0,1fr))" sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}}}>
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
              <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username} 
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
             />

             <TextField 
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password} 
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
             />
              <TextField 
                fullWidth
                variant="filled"
                type="text"
                label="Rol"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rol}
                name="rol"
                error={!!touched.rol && !!errors.rol} 
                helperText={touched.rol && errors.rol}
                sx={{ gridColumn: "span 4" }}
             />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Crear cuenta"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
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
