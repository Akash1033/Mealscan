import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  useMediaQuery,
  Paper,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NutritionDisplay from './components/NutritionDisplay';
import ScanHistory from './components/ScanHistory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AboutUs from './components/AboutUs';
import PageAnimation from './components/PageAnimation';

// Create a theme instance
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Accept': 'application/json'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

const ScanMeal = ({ 
  onDrop, 
  loading, 
  error, 
  scanResult, 
  imagePreview, 
  isDragActive, 
  getRootProps, 
  getInputProps 
}) => (
  <PageAnimation>
    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography 
        variant="h3"
        component="h1" 
        gutterBottom
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          textAlign: 'center',
          mb: 1
        }}
      >
        Scan Your Meal
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        paragraph 
        textAlign="center"
        sx={{ mb: 3, maxWidth: '500px' }}
      >
        Upload a clear photo of food to get instant nutritional insights
      </Typography>

      <Paper
        elevation={0}
        {...getRootProps()}
        sx={{
          width: '100%',
          maxWidth: '500px',
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          textAlign: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          background: theme => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            transform: loading ? 'none' : 'translateY(-4px)',
          },
          minHeight: imagePreview ? '300px' : '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: imagePreview && !loading && !scanResult ? `url(${imagePreview})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <input {...getInputProps()} disabled={loading} />
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={40} />
            <Typography variant="body2">Analyzing your image...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ color: isDragActive ? 'primary.main' : 'text.secondary' }}>
              {isDragActive ? "Drop your food image here..." : "Drag and drop a food image here, or click to select"}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              📸 Please upload clear photos of food only (pizza, burger, salad, etc.)
            </Typography>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, width: '100%', maxWidth: '500px', borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {scanResult && (
        <Box sx={{ width: '100%', maxWidth: '500px', mt: 3 }}>
          <NutritionDisplay
            foodItem={scanResult.foodItem}
            confidence={scanResult.confidence}
            nutritionData={scanResult.nutritionData}
            imageUrl={imagePreview}
          />
        </Box>
      )}

      <Box sx={{ width: '100%', maxWidth: '600px', mt: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Scan History
        </Typography>
        <ScanHistory />
      </Box>
    </Box>
  </PageAnimation>
);

const Dashboard = () => (
  <PageAnimation>
    <Box 
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '85%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              background: theme => theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, 
                    rgba(30, 60, 114, 1) 0%, 
                    rgba(42, 82, 152, 0.8) 50%,
                    rgba(30, 60, 114, 1) 100%)`
                : `linear-gradient(135deg, 
                    rgba(0, 180, 219, 1) 0%, 
                    rgba(0, 131, 176, 0.8) 50%,
                    rgba(0, 180, 219, 1) 100%)`,
              borderRadius: { xs: '20px', md: '24px' },
              pt: { xs: 6, md: 8 },
              pb: { xs: 8, md: 10 },
              mt: 3,
              mx: 'auto',
              width: '100%',
              animation: 'fadeIn 0.6s ease-out',
              '@keyframes fadeIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme => theme.palette.mode === 'dark'
                  ? `radial-gradient(circle at top left, rgba(42, 82, 152, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at top right, rgba(30, 60, 114, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at bottom left, rgba(30, 60, 114, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at bottom right, rgba(42, 82, 152, 0.8) 0%, transparent 50%)`
                  : `radial-gradient(circle at top left, rgba(0, 180, 219, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at top right, rgba(0, 131, 176, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at bottom left, rgba(0, 131, 176, 0.8) 0%, transparent 50%),
                     radial-gradient(circle at bottom right, rgba(0, 180, 219, 0.8) 0%, transparent 50%)`,
                opacity: 0.4,
                zIndex: 1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                zIndex: 1,
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme => `linear-gradient(45deg, 
                  ${theme.palette.mode === 'dark' ? 'rgba(30, 60, 114, 0.2)' : 'rgba(0, 180, 219, 0.2)'} 0%, 
                  transparent 100%)`,
                opacity: 0.6,
                zIndex: 1,
              }}
            />
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                  gap: { xs: 4, lg: 8 },
                  alignItems: 'center',
                }}
              >
                {/* Left Content */}
                <Box>
                  <Slide direction="right" in timeout={1200}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                        fontWeight: 900,
                        color: theme => theme.palette.mode === 'dark' 
                          ? '#ffffff'
                          : '#1a1a1a',
                        letterSpacing: '-0.02em',
                        mb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-12px',
                          left: 0,
                          width: '80px',
                          height: '4px',
                          background: theme => theme.palette.mode === 'dark'
                            ? 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)'
                            : '#1a1a1a',
                          borderRadius: '4px',
                        },
                        animation: 'slideIn 0.8s ease-out 0.3s both',
                        '@keyframes slideIn': {
                          from: {
                            opacity: 0,
                            transform: 'translateX(-30px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateX(0)',
                          },
                        },
                      }}
                    >
                      Welcome to MealScan
                    </Typography>
                  </Slide>

                  <Slide direction="right" in timeout={1400}>
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        color: theme => theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.9)'
                          : 'rgba(0,0,0,0.7)',
                        mb: 4,
                        maxWidth: '600px',
                        lineHeight: 1.6,
                        letterSpacing: '0.01em',
                        animation: 'slideIn 0.8s ease-out 0.5s both',
                      }}
                    >
                      Get instant nutritional insights from your food photos
                    </Typography>
                  </Slide>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: { xs: 3, md: 4 }, 
                      flexWrap: 'nowrap',
                      mb: 6,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {[
                      { value: '1K+', label: 'Food Items Scanned' },
                      { value: '80%+', label: 'Maximum Accuracy' }
                    ].map((stat, index) => (
                      <Grow
                        key={index}
                        in
                        timeout={1000 + (index * 200)}
                      >
                        <Box
                          sx={{
                            background: theme => theme.palette.mode === 'dark'
                              ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 203, 243, 0.15) 100%)'
                              : '#ffffff',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            p: 3,
                            minWidth: '180px',
                            border: '1px solid',
                            borderColor: theme => theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme => theme.palette.mode === 'dark'
                                ? '0 8px 20px rgba(33, 150, 243, 0.2)'
                                : '0 8px 20px rgba(0,0,0,0.1)',
                              borderColor: theme => theme.palette.mode === 'dark'
                                ? '#2196f3'
                                : 'rgba(0,0,0,0.2)',
                            },
                            animation: `popIn 0.6s ease-out ${0.7 + (index * 0.2)}s both`,
                            '@keyframes popIn': {
                              from: {
                                opacity: 0,
                                transform: 'scale(0.8)',
                              },
                              to: {
                                opacity: 1,
                                transform: 'scale(1)',
                              },
                            },
                          }}
                        >
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontSize: { xs: '2rem', md: '2.5rem' },
                              color: theme => theme.palette.mode === 'dark'
                                ? '#2196f3'
                                : '#1a1a1a',
                              fontWeight: 800,
                              mb: 1,
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography 
                            sx={{ 
                              color: theme => theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.8)'
                                : 'rgba(0,0,0,0.6)',
                              fontSize: '1rem',
                              fontWeight: 500,
                              letterSpacing: '0.02em',
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grow>
                    ))}
                  </Box>
                </Box>

                {/* Right Content - How to Use */}
                <Slide direction="left" in timeout={1600}>
                  <Box
                    sx={{
                      background: theme => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      p: { xs: 3, md: 4 },
                      border: '1px solid',
                      borderColor: theme => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(33, 150, 243, 0.2)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'slideIn 0.8s ease-out 0.7s both',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                        mb: 4,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      How to Use MealScan
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {[
                        "Take a clear photo of your food or upload an existing image",
                        "Our AI analyzes the image and identifies the food items",
                        "Get detailed nutritional information instantly"
                      ].map((text, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                              color: '#ffffff',
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              position: 'relative',
                              zIndex: 2,
                            }}
                          >
                            {index + 1}
                          </Box>
                          {index < 2 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: 24,
                                width: 2,
                                height: '100%',
                                background: 'linear-gradient(to bottom, #2196f3 0%, #21cbf3 100%)',
                                opacity: 0.3,
                                transform: 'translateY(25%)',
                                zIndex: 1,
                              }}
                            />
                          )}
                          <Typography 
                            sx={{ 
                              color: theme => theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.9)'
                                : 'rgba(0,0,0,0.8)',
                              fontSize: '1.1rem',
                              fontWeight: 500,
                              flex: 1,
                              lineHeight: 1.5,
                            }}
                          >
                            {text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Slide>
              </Box>
            </Container>
          </Box>
        </Fade>

        {/* Scan History Section */}
        <Fade in timeout={2000}>
          <Box sx={{ py: 6, width: '100%' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                textAlign: 'center',
                mb: 5,
                background: theme => theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
                  : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'fadeIn 0.8s ease-out 1s both',
              }}
            >
              Your Scan History
            </Typography>
            <Box
              sx={{
                animation: 'fadeIn 0.8s ease-out 1.2s both',
              }}
            >
              <ScanHistory />
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  </PageAnimation>
);

const App = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [imagePreview, setImagePreview] = useState(null);
  const [mode, setMode] = useState('light');
  const theme = getTheme(mode);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showError = (message) => {
    setError(message);
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setScanResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setScanResult({
        foodItem: response.data.food_item,
        confidence: response.data.confidence * 100,
        nutritionData: response.data.nutrition_data
      });
    } catch (err) {
      console.error('Error scanning food:', err);
      let errorMessage = 'Error processing image';
      
      if (err.response?.status === 503) {
        errorMessage = 'AI models are not available. Please check server configuration.';
      } else if (err.response?.status === 400) {
        const detail = err.response?.data?.detail || 'Invalid image file. Please try a different image.';
        
        // Check if it's a food validation error
        if (detail.includes("doesn't appear to be a food image") || 
            detail.includes("food image") || 
            detail.includes("Please upload a clear photo of food")) {
          errorMessage = '🍽️ ' + detail;
        } else if (detail.includes("too small") || detail.includes("too large")) {
          errorMessage = '📏 ' + detail;
        } else if (detail.includes("properly oriented")) {
          errorMessage = '📐 ' + detail;
        } else {
          errorMessage = '❌ ' + detail;
        }
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      }
      
      showError(errorMessage);
      setImagePreview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(120deg, #f0f2f5 0%, #e3f2fd 100%)'
            : 'linear-gradient(120deg, #1a1a1a 0%, #2c2c2c 100%)',
          transition: 'background 0.3s ease-in-out',
          overflowX: 'hidden',
        }}
      >
        <Navbar toggleTheme={toggleTheme} mode={mode} />
        
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/scan" replace />} 
            />
            <Route 
              path="/scan" 
              element={
                <Container maxWidth="md">
                  <ScanMeal
                    onDrop={onDrop}
                    loading={loading}
                    error={error}
                    scanResult={scanResult}
                    imagePreview={imagePreview}
                    isDragActive={isDragActive}
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                  />
                </Container>
              } 
            />
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
            <Route 
              path="/about" 
              element={
                <PageAnimation>
                  <AboutUs />
                </PageAnimation>
              } 
            />
          </Routes>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              sx={{ borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App; 