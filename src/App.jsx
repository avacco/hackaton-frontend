import { CssBaseline, ThemeProvider } from '@mui/material'
import Topbar from './components/Topbar'

import { Route, Routes } from 'react-router-dom';
import Dashboard from './scenes/admin/dashboard';
import Employees from './scenes/admin/employees';
import Patients from './scenes/admin/patients';
import Invoices from './scenes/admin/invoices';
import Form from './scenes/admin/form';
import Calendar from './scenes/admin/calendar';
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
                <Route path="/system/invoices" element={<Invoices />} />
                <Route path="/system/adminform" element={<AdminForm />} />
                <Route path="/system/form" element={<Form />} />
              </Route>

              <Route path="/bar" element={<Dashboard />} />
              <Route path="/line" element={<Dashboard />} />
              <Route path="/faq" element={<Dashboard />} />
              <Route path="/geography" element={<Dashboard />} />
              <Route path="/system/calendar" element={<Calendar />} />
              <Route path='*' element={<NotFound />} />
            </Routes>

      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
