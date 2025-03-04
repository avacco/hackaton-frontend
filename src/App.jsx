import { CssBaseline, ThemeProvider } from '@mui/material'

import { Route, Routes } from 'react-router-dom';
import Dashboard from './scenes/admin/dashboard';
import Employees from './scenes/admin/medics';
import Patients from './scenes/admin/patients';
import Form from './scenes/admin/medicform';
import LoginForm from './scenes/login';
import { useEffect, useState } from 'react';
import AuthProvider from './provider/AuthProvider';
import Administrators from './scenes/admin/administrators';
import AdminForm from './scenes/admin/adminform';
import Homepage from './scenes/client/homepage';
import NotFound from './scenes/global/NotFound';
import Contact from './scenes/client/contact';
import Consultation from './scenes/client/consultation';
import Examinations from './scenes/client/examinations';
import About from './scenes/client/about';
import { theme } from './theme'
import SystemWrapper from './scenes/admin';
import PageWrapper from './scenes/client';
import Calendar from './scenes/admin/calendar';
import ServicesForm from './scenes/admin/serviceform';
import Services from './scenes/admin/services';
import PatientForm from './scenes/admin/patientform';
import ServicePacks from './scenes/admin/servicepacks';

function App() {

  const [isLoading, setIsLoading] = useState(true);

  const [token, setToken] = useState()
  useEffect(() => {
    const auth = localStorage.getItem("auth_token")
    setToken(auth)
    return () => {
      setIsLoading(false)
    }
  }, [token])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>

            <Routes>
              <Route element={<PageWrapper />} >
                <Route path="/" element={<Homepage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/consultation" element={<Consultation />} />  
                <Route path="/examinations" element={<Examinations />} /> 
                <Route path="/about" element={<About />} />  
                <Route path="/login" element={<LoginForm/>} />
              </Route>

              <Route path="/system" element={<SystemWrapper />} >  
                <Route path="/system/dashboard" element={<Dashboard />} />
                <Route path="/system/administrators" element={<Administrators />} />
                <Route path="/system/employees" element={<Employees />} />
                <Route path="/system/patients" element={<Patients />} />
                <Route path="/system/servicepacks" element={<ServicePacks />} />
                <Route path="/system/services" element={<Services />} />
                <Route path="/system/adminform" element={<AdminForm />} />
                <Route path="/system/patientform" element={<PatientForm />} />
                <Route path="/system/form" element={<Form />} />
                <Route path="/system/serviceform" element={<ServicesForm />} />
                <Route path="/system/calendar" element={<Calendar />} />
                <Route path="/system/logout" element={<Dashboard />} />
              </Route>
                            
              <Route path='*' element={<NotFound />} />
            </Routes>

      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
