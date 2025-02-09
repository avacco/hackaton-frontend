import React, { useState } from "react";
import { Card,  CardContent,  TextField,  Button,  Typography,  Select,  MenuItem,  FormControl,  InputLabel,  Container,  Box,  Alert,  Snackbar, Grid2, IconButton } from "@mui/material";
import { BsTelephone, BsEnvelope, BsClock, BsGeoAlt, BsTwitterX } from "react-icons/bs";
import { Footer } from "../../../components/Footer";
import * as yup from 'yup';
import { Formik } from "formik";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";


const Contact = () => {


  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  }
  
  const formSchema = yup.object().shape({
    firstName: yup.string().required("Requerido"),
    lastName: yup.string().required("Requerido"),
    email: yup.string().email("Correo inválido").required("Requerido"),
    phone: yup.number().required("Requerido"),
    reason: yup.string().required("Requerido"),
    message: yup.string().required("Requerido")
  })

  const iconBox ={display: "flex",  alignItems: "center",  marginBottom: "1rem",  gap: "1rem"}

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleFormSubmit = async (values) => {
    if (loading) return;

    setLoading(true);
    try {
      // Esto no esta planeado que sea conectado a una API, asi que dejo una simulación.
      
      // Para probar errores 
      // throw new Error

      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSnackbar({
        open: true,
        message: "Su mensaje se ha enviado. Nos pondremos en contacto pronto.",
        severity: "success"
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ha ocurrido un error.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box sx={{ display: "flex", overflowX: "auto"}}>
      <iframe width="100%" height="600" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=Avenida%20Acoyte%20100+(Clinica%20Medica)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
    </Box>
    <Container maxWidth="lg" sx={{ py: 8, display:"flex" }}>
      <Grid2 container spacing={4}>
        <Grid2 size={{xs:12, lg:8}}>
          <Card sx={{ height: "100%",  backgroundColor: "#f8f9fa",  boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Contáctanos
              </Typography>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={formSchema}
              >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        error={!!touched.firstName && !!errors.firstName}
                        helperText={touched.firstName && errors.firstName}
                        required
                      />
                    </Grid2>
                    <Grid2 size={6}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={!!touched.lastName && !!errors.lastName}
                        helperText={touched.lastName && errors.lastName}
                        required
                      />
                    </Grid2>
                    
                      <TextField
                        fullWidth
                        label="Correo"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        required
                      />
                    
                      <TextField
                        fullWidth
                        label="Número de contacto"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        error={!!touched.phone && !!errors.phone}
                        helperText={touched.phone && errors.phone}
                      />
                    
                      <FormControl fullWidth required error={!!errors.reason}>
                        <InputLabel>Motivo por el contacto</InputLabel>
                        <Select
                          name="reason"
                          value={values.reason}
                          onChange={handleChange}
                          label="Motivo por el contacto"
                        >
                          <MenuItem value="Consulta general">Consulta general</MenuItem>
                          <MenuItem value="Sugerencias">Sugerencias</MenuItem>
                          <MenuItem value="Reclamos">Reclamos</MenuItem>
                          <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                      </FormControl>
                    
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Mensaje"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        placeholder="Detalle el motivo de contacto..."
                      />
                    
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                      >
                        {loading ? "Enviando..." : "Enviar mensaje"}
                      </Button>
                    
                  </Grid2>
                </form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{xs:12, lg:4}}>
          <Card sx={{backgroundColor: "#f8f9fa",  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"}}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Datos de Contacto
              </Typography>
              
              <Box sx={iconBox}>
                <BsTelephone size={24} />
                <Box>
                  <Typography variant="h6">Teléfono</Typography>
                  <Typography variant="body1">(54) 9 11 1234-5689</Typography>
                </Box>
              </Box>

              <Box sx={iconBox}>
                <BsEnvelope size={24} />
                <Box>
                  <Typography variant="h6">Correo</Typography>
                  <Typography variant="body1">administracion@juntosalud.com</Typography>
                </Box>
              </Box>

              <Box sx={iconBox}>
                <BsGeoAlt size={24} />
                <Box>
                  <Typography variant="h6">Dirección</Typography>
                  <Typography variant="body1">
                    Av. Acoyte 100
                    <br />
                    Buenos Aires, Argentina
                  </Typography>
                </Box>
              </Box>

              <Box sx={iconBox}>
                <BsClock size={24} />
                <Box>
                  <Typography variant="h6">Horarios de atención</Typography>
                  <Typography variant="body1">
                    Lunes - Viernes: 07:00 - 20:00
                    <br />
                    Sabado: 07:00 AM - 16:00
                    <br />
                    Domingo: Cerrado
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Grid2 container spacing={5} justifyContent="center" display="flex">
            <IconButton>
              <FaWhatsapp size={30}/>
            </IconButton>
            <IconButton>
              <FaInstagram size={30}/>
            </IconButton>
            <IconButton>
              <FaFacebook size={30}/>
            </IconButton>
            <IconButton>
              <BsTwitterX size={29}/>
            </IconButton>
          </Grid2>
        </Grid2>
      </Grid2>

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
    </Container>
    <Footer />
    </>
  );
};

export default Contact;