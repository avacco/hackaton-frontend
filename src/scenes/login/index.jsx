import { useEffect, useState } from "react";
import {Box, Button,  Card,  CardContent, IconButton, InputAdornment,  TextField, Typography, CircularProgress, Snackbar, Alert} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined, LockOutlined, PersonOutlineOutlined} from "@mui/icons-material";
import * as yup from 'yup'
import { Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import https from "https";

const LoginForm = () => {

  const { setToken } = useAuth();

  const userSchema = yup.object().shape({
    username: yup.string().required("Requerido"),
    password: yup.string().required("Requerido"),
  })

  const initialValues = {    
    username: "",
    password: "",
  };

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken();
  }, [])
  
  
  // Popups para exito y fracaso en login
  const [snackbar, setSnackbar] = useState(
    {
      open: false,
      message: "",
      severity: "success"
    }
  );

  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const route = import.meta.env.VITE_API_ROUTE;
  const handleFormSubmit = async (values) => {
    setLoading(true)

    await axios
              .post(`${route}/personal/login`, httpsAgent, values)
              .then((response) => {
                  setToken(response.data);
                  setSnackbar({
                    open: true,
                    message: "Ingreso exitoso",
                    severity: "success"
                  });
                  navigate("/system/dashboard");

            }).catch((error) => {
                console.log(error);
                setSnackbar({
                  open: true,
                  message: "Error al ingresar. Revisa las credenciales.",
                  severity: "error"
                });
                setLoading(false)
            })
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Formik
        onSubmit={handleFormSubmit} 
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
        <Card sx={{backgroundColor:"#F8F9FA"}}>
          <CardContent>
            <Typography variant="h3" align="center" gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" sx={{ mb: 4 }}>
              Ingresa tus credenciales para continuar.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo"
                name="username"
                onBlur={handleBlur}
                value={values.username}
                onChange={handleChange}
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                slotProps={{
                  input: {
                    startAdornment: 
                    <InputAdornment position="start">
                      <PersonOutlineOutlined />
                    </InputAdornment>
                  }
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                slotProps={{
                  input: {
                    startAdornment: 
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ,
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
                sx={{ mb: 2 }}
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{ mb: 3, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
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
  );
};

export default LoginForm;