import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
  Avatar,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(33, 150, 243, 0.15)',
          '& .feature-icon': {
            transform: 'scale(1.1)',
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            '& svg': {
              color: '#ffffff',
              transform: 'scale(1.1)',
            }
          },
          '& .feature-title': {
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          },
          '&::before': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          transition: 'transform 0.5s ease-out, opacity 0.3s ease-out',
          pointerEvents: 'none',
        },
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Avatar
          className="feature-icon"
          sx={{
            width: 80,
            height: 80,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #2196f3 20%, #21cbf3 80%)'
              : 'linear-gradient(135deg, #2196f3 20%, #21cbf3 80%)',
            mb: 3,
            transition: 'all 0.3s ease-out',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(33, 150, 243, 0.3)'
              : '0 4px 20px rgba(33, 150, 243, 0.2)',
            '& svg': {
              fontSize: '2.5rem',
              color: '#ffffff',
              transition: 'all 0.3s ease-out',
            },
          }}
        >
          <Icon />
        </Avatar>
        <Typography 
          variant="h5" 
          gutterBottom 
          className="feature-title"
          sx={{ 
            fontWeight: 600,
            mb: 2,
            transition: 'all 0.3s ease-out',
          }}
        >
          {title}
        </Typography>
        <Typography 
          color="text.secondary"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '300px',
            mx: 'auto',
            transition: 'color 0.3s ease-out',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

const AboutUs = () => {
  const theme = useTheme();

  const features = [
    {
      icon: RestaurantIcon,
      title: "Smart Food Recognition",
      description: "Our advanced AI technology accurately identifies food items from images, making meal tracking effortless and precise."
    },
    {
      icon: AutoFixHighIcon,
      title: "Instant Nutrition Analysis",
      description: "Get detailed nutritional information including calories, proteins, carbs, and fats immediately after scanning your meal."
    },
    {
      icon: PrivacyTipIcon,
      title: "Privacy First",
      description: "Your data security is our priority. All scans are processed securely and your information remains private."
    }
  ];

  return (
    <Box sx={{ 
      py: 8,
      minHeight: '100vh',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(120deg, #1a1a1a 0%, #2c2c2c 100%)'
        : 'linear-gradient(120deg, #f0f2f5 0%, #e3f2fd 100%)',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 3,
              background: theme => theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
                : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About MealScan
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 8,
              lineHeight: 1.6,
            }}
          >
            MealScan is your intelligent food companion that makes nutrition tracking simple and accurate through advanced AI technology.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              mt: 8,
              p: 6,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              transition: 'all 0.3s ease-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                  : '0 8px 24px rgba(33, 150, 243, 0.15)',
              },
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
            }}>
              Our Mission
            </Typography>
            <Typography color="text.secondary" sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.8,
            }}>
              We're on a mission to make healthy eating easier for everyone. By combining cutting-edge AI technology with user-friendly design, 
              MealScan helps you make informed decisions about your nutrition without the hassle of manual tracking or guesswork.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs; 