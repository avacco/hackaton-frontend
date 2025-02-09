import { ColorModeContext } from './theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Topbar from './components/Topbar'
import { useMode } from './theme';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './scenes/admin/dashboard';
import Sidebar from './components/Sidebar';
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
import Information from './scenes/client/information';
import NotFound from './scenes/global/NotFound';
import Contact from './scenes/client/contact';
import Consultation from './scenes/client/consultation';
import Examinations from './scenes/client/examinations';
import About from './scenes/client/about';
import Services from './scenes/client/services';

function App() {


  const [isLoading, setIsLoading] = useState(true);
  const [theme, colorMode] = useMode();

  const [token, setToken] = useState()
  useEffect(() => {
    const auth = localStorage.getItem("auth_token")
    setToken(auth)
    return () => {
      setIsLoading(false)
    }
  }, [token])

  return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <div className='app'>        
        {/* Oculta sidebar para usuarios fuera del sistema. Debe estar logeado tambien. */}
      {location.href.includes("/system") && token && <Sidebar/>}
          <main className='content'>
          {!location.href.includes("/system") && <Topbar/>}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/services" element={<Services />} /> 
              <Route path="/information" element={<Information />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginForm />} />  
              <Route path="/consultation" element={<Consultation />} />  
              <Route path="/examinations" element={<Examinations />} /> 
              <Route path="/about" element={<About />} />  
              {token && (
              <>
                <Route path="/system/dashboard" element={<Dashboard />} />
                <Route path="/system/administrators" element={<Administrators />} />
                <Route path="/system/employees" element={<Employees />} />
                <Route path="/system/patients" element={<Patients />} />
                <Route path="/system/invoices" element={<Invoices />} />
                <Route path="/system/adminform" element={<AdminForm />} />
                <Route path="/system/form" element={<Form />} />
              </>
              )}
              <Route path="/bar" element={<Dashboard />} />
              <Route path="/line" element={<Dashboard />} />
              <Route path="/faq" element={<Dashboard />} />
              <Route path="/geography" element={<Dashboard />} />
              <Route path="/system/calendar" element={<Calendar />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
      </div>
      </AuthProvider>
    </ThemeProvider>
  </ColorModeContext.Provider>
  )
}

export default App
