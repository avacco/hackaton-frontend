import { useEffect, useState } from 'react'
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { tokens } from '../theme'
import { HomeOutlined, PeopleOutlineOutlined, ContactsOutlined, ReceiptOutlined, PersonOutlineOutlined, CalendarTodayOutlined, PieChartOutlineOutlined, TimelineOutlined, BarChartOutlined, MenuOutlined, MapOutlined, SupervisorAccountOutlined, AdminPanelSettingsOutlined, LogoutOutlined } from '@mui/icons-material'
import 'react-pro-sidebar/dist/css/styles.css';
import { useAuth } from '../provider/AuthProvider'
import axios from 'axios'

// Mini componente para los items del menu.
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem active={selected === title} style={{ color: colors.grey[100] }} onClick={() => setSelected(title)} icon={icon}>
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  )
}

const Sidebar = () => {

  const [responsedata, setresponsedata] = useState()
  const { token } = useAuth();
  const { setToken } = useAuth();
  const route = import.meta.env.VITE_API_ROUTE;
  
  useEffect(() => {

    axios
        .get(`${route}/user/user`,{
          headers: { Authorization: "Bearer "+token }
        })
        .then(response => {          
          setresponsedata(response.data)   
        })
        .catch((error) => { 
          if(error.response.status === 401)
            setToken();
        })
  }, [])

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard"); // Estado por defecto, seleccionado en Dashboard
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken();
    navigate("/");
    location.reload()
  };

  return (
  // Overrides para estilos de sidebar
    <Box sx={{ 
      "& .pro-sidebar-inner": {
        background: `${colors.primary[400]} !important` 
    },
      "& .pro-icon-wrapper": {
        backgroundColor: "transparent !important"
      },
      "& .pro-inner-item": {
        padding: "5px 35px 5px 20px !important"
      },
      "& .pro-inner-item:hover": {
        color: "#868dfb !important"
      },
      "& .pro-menu-item.active": {
        color: "#6870fa !important"
      }}}>
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} style={{ margin: "10px 0 20px 0", color: colors.grey[100]}} icon={isCollapsed ? <MenuOutlined /> : undefined} >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
              <Typography variant='h3' color={colors.grey[100]}>
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
                <Typography variant='h2' color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>{responsedata ? responsedata.username : "Usuario"}</Typography>
                <Typography variant='h5' color={colors.greenAccent[500]}>{responsedata ? responsedata.rol : "Sin rol"}</Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}> 
            <Item title="Salir" to="/system/dashboard" icon={<LogoutOutlined />} selected={false} setSelected={handleLogout}/>
            <Item title="Dashboard" to="/system/dashboard" icon={<HomeOutlined />} selected={selected} setSelected={setSelected}/>

            <Typography variant='h6' color={colors.grey[300]} sx={{ m: "15px 0 5px 20px"}}>Datos</Typography>

            <Item title="Administradores" to="/system/administrators" icon={<AdminPanelSettingsOutlined />} selected={selected} setSelected={setSelected}/>
            <Item title="Medicos" to="/system/employees" icon={<PeopleOutlineOutlined />} selected={selected} setSelected={setSelected}/>
            <Item title="Pacientes" to="/system/patients" icon={<ContactsOutlined />} selected={selected} setSelected={setSelected}/>
            <Item title="Facturas" to="/system/invoices" icon={<ReceiptOutlined />} selected={selected} setSelected={setSelected}/>

            <Typography variant='h6' color={colors.grey[300]} sx={{ m: "15px 0 5px 20px"}}>Paginas</Typography>

            <Item title="Formulario admin" to="/system/adminform/" icon={<SupervisorAccountOutlined />} selected={selected} setSelected={setSelected}/>
            <Item title="Formulario medicos" to="/system/form" icon={<PersonOutlineOutlined />} selected={selected} setSelected={setSelected}/>
            <Item title="Turnos" to="/system/calendar" icon={<CalendarTodayOutlined />} selected={selected} setSelected={setSelected}/>

            <Typography variant='h6' color={colors.grey[300]} sx={{ m: "15px 0 5px 20px"}}>Gráficos (WIP)</Typography>
          </Box>
        </Menu>
      </ProSidebar>

    </Box>
  )
}

export default Sidebar;
