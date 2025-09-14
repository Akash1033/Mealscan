import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  useTheme,
  IconButton,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InfoIcon from '@mui/icons-material/Info';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { title: 'Scan Meal', path: '/scan', icon: CameraAltIcon },
    { title: 'About Us', path: '/about', icon: InfoIcon },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon 
                sx={{ 
                  mr: 1,
                  color: theme.palette.primary.main,
                  fontSize: '2rem',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                MealScan
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Your intelligent food companion that makes nutrition tracking simple and accurate through advanced AI technology.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component={MuiLink}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component={MuiLink}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component={MuiLink}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Box
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: theme.palette.mode === 'light' ? '#1a1a1a' : '#fff',
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: '1.2rem' }} />
                    <Typography variant="body2">{link.title}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              Have questions? We'd love to hear from you.
            </Typography>
            <Typography 
              variant="body2" 
              component={MuiLink}
              href="mailto:critical2315@gmail.com"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              critical2315@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 2 }} />

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{
            py: 1,
            fontSize: '0.8rem',
            opacity: 0.8
          }}
        >
          © {currentYear} MealScan. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 