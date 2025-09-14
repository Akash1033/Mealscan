import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Fade,
  useTheme,
  Chip,
  LinearProgress,
} from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import GrainIcon from '@mui/icons-material/Grain';

const NutritionDisplay = ({ foodItem, confidence, nutritionData, imageUrl }) => {
  const theme = useTheme();
  
  const formatValue = (value) => {
    if (value === 0) return '0';
    if (!value) return 'N/A';
    return value.toFixed(1);
  };

  const NutritionItem = ({ icon: Icon, value, label, color }) => (
    <Box 
      sx={{ 
        textAlign: 'center',
        p: 2,
        borderRadius: 2,
        bgcolor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Icon sx={{ fontSize: 40, color: color }} />
      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
        {formatValue(value)}
        <Typography component="span" variant="body2" color="text.secondary">
          g
        </Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );

  return (
    <Fade in timeout={500}>
      <Card 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          mt: 4,
          overflow: 'visible',
          bgcolor: theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: theme.shadows[8],
        }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            height="300"
            image={imageUrl}
            alt={foodItem}
            sx={{ 
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
            }}
          />
        )}
        <CardContent sx={{ position: 'relative' }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h4" 
              component="div" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {foodItem}
              <Chip 
                label={`${confidence.toFixed(1)}% confidence`}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            
            <LinearProgress 
              variant="determinate" 
              value={confidence} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'light' 
                  ? 'rgba(0,0,0,0.1)' 
                  : 'rgba(255,255,255,0.1)',
              }} 
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <NutritionItem
                icon={LocalFireDepartmentIcon}
                value={nutritionData.calories}
                label="Calories"
                color={theme.palette.error.main}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <NutritionItem
                icon={FitnessCenterIcon}
                value={nutritionData.proteins}
                label="Proteins"
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <NutritionItem
                icon={GrainIcon}
                value={nutritionData.carbs}
                label="Carbs"
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <NutritionItem
                icon={BakeryDiningIcon}
                value={nutritionData.fats}
                label="Fats"
                color={theme.palette.secondary.main}
              />
            </Grid>
          </Grid>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 3,
              fontStyle: 'italic',
            }}
          >
            Values per {nutritionData.serving_size || '100g'}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default NutritionDisplay; 