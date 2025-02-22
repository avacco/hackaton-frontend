import { useState } from "react";
import { Box, IconButton, AppBar, Container, Toolbar, Typography, Menu, MenuItem, Tooltip, Button } from "@mui/material";
import { LoginOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GridMenuIcon } from "@mui/x-data-grid";

export default function Topbar() {


  // Items de menu de navegacion, usado por el topbar normal y el de movil.
  const topbarItems = [
    { title: "Inicio", nav: "/" },
    { title: "Agendar una consulta ", nav: "/consultation" },
    { title: "Historial de paciente", nav: "/examinations" },
    { title: "Nosotros", nav: "/about" },
    { title: "Contáctanos ", nav: "/contact" },
  ]

  
  const navigate = useNavigate()

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
      <AppBar sx={{backgroundColor:""}} color="" position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                my: 2,
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <img width="125px" height="75px" src="/juntosalud.png"></img>
            </Typography>
            {/* Menu en pantalla chica */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <GridMenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
              {topbarItems.map((item, index) => (
                <MenuItem key={index} onClick={() => navigate(item.nav)}>
                  <Typography sx={{ textAlign: 'center' }}>{item.title}</Typography>
                </MenuItem>
              ))}

              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 500,
                letterSpacing: '.1rem',
                textDecoration: 'none',
                fontSize: 30,
                color:"#2293CA",
              }}
            >
              Junto Salud
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {topbarItems.map((item, index) => (
                  <Button key={index} onClick={() => navigate(item.nav)} sx={{ my: 2, display: 'block' }}>
                    <Typography>{item.title}</Typography>
                  </Button>
                ))}

            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Acceso empleados">
                <IconButton onClick={() => navigate("/login")}>
                  <LoginOutlined />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: 'center' }}>Settings</Typography>
                  </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  )
}