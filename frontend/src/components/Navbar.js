import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ toggleTheme, mode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;

  const NavItems = () => (
    <>
      <Button
        component={Link}
        to="/dashboard"
        sx={{
          mr: 2,
          position: 'relative',
          color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
          '&:hover': {
            background: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.1)',
          },
          '&::after': isActive('/dashboard') ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: theme.palette.primary.main,
          } : {},
        }}
        startIcon={
          <DashboardIcon sx={{ 
            color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
          }} />
        }
      >
        Dashboard
      </Button>
      <Button
        component={Link}
        to="/scan"
        sx={{
          mr: 2,
          position: 'relative',
          color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
          '&:hover': {
            background: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.1)',
          },
          '&::after': isActive('/scan') ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: theme.palette.primary.main,
          } : {},
        }}
        startIcon={
          <CameraAltIcon sx={{ 
            color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
          }} />
        }
      >
        Scan Meal
      </Button>
      <Button
        component={Link}
        to="/about"
        sx={{
          position: 'relative',
          color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
          '&:hover': {
            background: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.1)',
          },
          '&::after': isActive('/about') ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: theme.palette.primary.main,
          } : {},
        }}
        startIcon={
          <InfoIcon sx={{ 
            color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
          }} />
        }
      >
        About Us
      </Button>
    </>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        bgcolor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(18, 18, 18, 0.8)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box 
            component={Link} 
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
            }}
          >
            <RestaurantIcon 
              sx={{ 
                mr: 1,
                color: theme.palette.primary.main,
                fontSize: '2rem',
              }} 
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MealScan
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <>
                <IconButton
                  sx={{ 
                    ml: 1,
                    color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
                  }}
                  onClick={handleMenuClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      backgroundImage: 'none',
                      bgcolor: theme.palette.mode === 'light' 
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(18, 18, 18, 0.9)',
                      backdropFilter: 'blur(10px)',
                    }
                  }}
                >
                  <MenuItem 
                    component={Link} 
                    to="/dashboard"
                    selected={isActive('/dashboard')}
                    sx={{
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                    }}
                  >
                    <DashboardIcon sx={{ 
                      mr: 1,
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
                    }} /> 
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/scan"
                    selected={isActive('/scan')}
                    sx={{
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                    }}
                  >
                    <CameraAltIcon sx={{ 
                      mr: 1,
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
                    }} /> 
                    Scan Meal
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/about"
                    selected={isActive('/about')}
                    sx={{
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                    }}
                  >
                    <InfoIcon sx={{ 
                      mr: 1,
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
                    }} /> 
                    About Us
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <NavItems />
            )}
            
            <IconButton 
              onClick={toggleTheme} 
              sx={{ 
                ml: 2,
                color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff'
              }}
            >
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 