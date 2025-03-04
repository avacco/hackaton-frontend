import { useEffect, useState } from 'react'
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Box, IconButton, Typography } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HomeOutlined, PeopleOutlineOutlined, ContactsOutlined, ReceiptOutlined, PersonOutlineOutlined, CalendarTodayOutlined, MenuOutlined, SupervisorAccountOutlined, AdminPanelSettingsOutlined, LogoutOutlined, ManageAccountsOutlined, MedicalServicesOutlined, Person3Outlined } from '@mui/icons-material'
import { useAuth } from '../provider/AuthProvider'
import axios from 'axios'

// Mini componente para los items del menu.
const Item = ({ title, to, icon, selected }) => {
  return (
    <MenuItem component={<Link to={to} />} active={selected === title} style={{ color: "black" }} icon={icon}>
      <Typography>{title}</Typography>
    </MenuItem>
  )
}

const Sidebar = () => {

  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;

  const location = useLocation();
  
  // Cambia el item seleccionado en el sidebar dependiendo de la ruta actual.
  useEffect(() => {
    switch (location.pathname) {
      case "/system/dashboard":
        setSelected("Dashboard")
        break;
      
      case "/system/administrators":
        setSelected("Administradores")
        break;

      case "/system/employees":
        setSelected("Médicos")
        break;

      case "/system/patients":
        setSelected("Pacientes")
        break;

      case "/system/servicepacks":
        setSelected("Paquetes")
        break;
        
      case "/system/services":
        setSelected("Servicios")
        break;

      case "/system/adminform/":
        setSelected("Formulario admin")
        break;

      case "/system/form":
        setSelected("Formulario médicos")
        break;

      case "/system/serviceform":
        setSelected("Formulario servicios")
        break;

      case "/system/patientform":
        setSelected("Formulario paciente")
        break;
        
      case "/system/calendar":
        setSelected("Citas")
        break;

      case "/system/logout":
        handleLogout()
        break;

      default:
        break;
    }
  }, [location])
  

  useEffect(() => {
    axios
        .get(`${route}/user/user`,{
          headers: { Authorization: "Bearer "+token }
        })
        .then(response => {          
          setresponsedata(response.data)   
        })
        .catch((error) => { 
            localStorage.removeItem('auth_token')
            navigate("/login");
        })
  }, [])

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard"); // Estado por defecto, seleccionado en Dashboard
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    navigate("/");
  };

  return (
  // Overrides para estilos de sidebar
    <Box sx={{ 
      "& .ps-sidebar-container": {
        background: `#F5F5F5` 
    },
      "& .ps-menu-icon": {
        backgroundColor: "transparent !important"
      },
      "& .ps-inner-item": {
        padding: "5px 35px 5px 20px !important"
      },
      "& .ps-menu-button:hover": {
        color: "green !important"
      },
      "& .ps-menuitem-root .ps-active": {
        color: "green !important"
      }}}>
      <ProSidebar collapsed={isCollapsed}>
        <Menu style={{height:"120vh"}} iconShape="square">
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} style={{ margin: "10px 0 20px 0", color: "gray"}} icon={isCollapsed ? <MenuOutlined /> : undefined} >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
              <Typography variant='h3' color="gray">
                Administración
              </Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlined />
              </IconButton>
            </Box>
          )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img alt='Perfil' width="100px" height="100px" src="data:image/jpeg;base64,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" style={{ cursor: "pointer", borderRadius: "50%"}}/>
              </Box>
              <Box textAlign="center">
                <Typography variant='h2' color="black" fontWeight="bold" sx={{ m: "10px 0 0 0" }}>{responsedata ? responsedata.username : "Usuario"}</Typography>
                <Typography variant='h5' color="green">{responsedata ? responsedata.rol : "Sin rol"}</Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}> 
            <Item title="Salir" to="/system/logout" icon={<LogoutOutlined />} selected={false} />
            <Item title="Dashboard" to="/system/dashboard" icon={<HomeOutlined />} selected={selected} />

            <Typography variant='h6' color="gray" sx={{ m: "15px 0 5px 20px"}}>Datos</Typography>

            <Item title="Administradores" to="/system/administrators" icon={<AdminPanelSettingsOutlined />} selected={selected} />
            <Item title="Médicos" to="/system/employees" icon={<PeopleOutlineOutlined />} selected={selected} />
            <Item title="Pacientes" to="/system/patients" icon={<ContactsOutlined />} selected={selected} />
            <Item title="Paquetes" to="/system/servicepacks" icon={<ReceiptOutlined />} selected={selected} />
            <Item title="Servicios" to="/system/services" icon={<MedicalServicesOutlined />} selected={selected} /> 

            <Typography variant='h6' color="gray" sx={{ m: "15px 0 5px 20px"}}>Paginas</Typography>

            <Item title="Formulario admin" to="/system/adminform/" icon={<SupervisorAccountOutlined />} selected={selected} />
            <Item title="Formulario médicos" to="/system/form" icon={<PersonOutlineOutlined />} selected={selected} />
            <Item title="Formulario servicios" to="/system/serviceform" icon={<ManageAccountsOutlined />} selected={selected} />
            <Item title="Formulario paciente" to="/system/patientform" icon={<Person3Outlined />} selected={selected} />
            
           {/* <Item title="Citas" to="/system/calendar" icon={<CalendarTodayOutlined />} selected={selected} />*/}

           {/* <Typography variant='h6' color="gray" sx={{ m: "15px 0 5px 20px"}}>Gráficos (WIP)</Typography>  */}
          </Box>
        </Menu>
      </ProSidebar>

    </Box>
  )
}

export default Sidebar;
