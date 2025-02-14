import { Alert, Box, Button, Card, CircularProgress, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import Header from "../../../components/Header"
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../../provider/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { LockOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export default function AdminForm() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { token } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;
 
  // Valores iniciales para campos de formulario
  const [initialValues, setInitialValues] = useState({
    id_persona: "",
    nombre: "",
    apellido: "",
    dni: "",
    fechaNac: "",
    email: "",
    telefono: "",
    direccion: "",
    username: "",
    password: "",
    rol: "",
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
    username: yup.string().required("Requerido"),
    password: yup.string().required("Requerido"),
    rol: yup.string().required("Requerido"),
  })

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Popups para exito y fracaso en login
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );


  const { state } = useLocation();

  useEffect(() => {
    if(state) {
      axios
        .get(`${route}/personal/traer/${state}`,
          { headers: { Authorization: "Bearer "+token }
        },)
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
            username: data.username,
            password: "", // No se debe enviar la contraseña
            rol: data.rol,
          })
        },
      )
    }
  }, [state])
  



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
                    message: state ? "Personal editado" : "Peronal administrativo creado",
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
      <Header title="Crear perfil de empleado" subtitle="Formulario de inscripción" />
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
                sx={{ gridColumn: "span 2" }}
             />

             <TextField 
                fullWidth
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password} 
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
                slotProps={{
                  input: {
                    endAdornment: 
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                }}
              
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
