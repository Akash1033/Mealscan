import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Collapse,
  useTheme,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FastfoodIcon from '@mui/icons-material/Fastfood';

const ScanHistory = () => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    // Mock data for now
    const mockHistory = [
      {
        id: 1,
        food_item: "Fried Rice",
        timestamp: "9:26 PM",
        confidence: 94.8,
        nutrition_data: {
          calories: 156,
          proteins: 3.7,
          carbs: 29.1,
          fats: 2.6
        }
      },
      {
        id: 2,
        food_item: "Chicken Curry",
        timestamp: "8:23 PM",
        confidence: 99.2,
        nutrition_data: {
          calories: 171,
          proteins: 5.4,
          carbs: 16,
          fats: 9.3
        }
      },
      {
        id: 3,
        food_item: "Risotto (Soup)",
        timestamp: "8:21 PM",
        confidence: 51.9,
        nutrition_data: {
          calories: 347,
          proteins: 7.5,
          carbs: 73,
          fats: 2.4
        }
      }
    ];
    setHistory(mockHistory);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 90) return '#4CAF50';
    if (confidence > 70) return '#FFC107';
    return '#f44336';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence > 90) return 'rgba(76, 175, 80, 0.1)';
    if (confidence > 70) return 'rgba(255, 193, 7, 0.1)';
    return 'rgba(244, 67, 54, 0.1)';
  };

  return (
    <Box sx={{ 
      mt: 4,
      width: '100%',
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        mb: 3,
        px: 1
      }}>
        <FastfoodIcon sx={{ 
          color: theme.palette.primary.main,
          fontSize: '1.5rem'
        }} />
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
          }}
        >
          Recent Scans
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <List sx={{ width: '100%' }}>
          {history.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: 3,
                borderBottom: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                '&:last-child': {
                  borderBottom: 'none'
                },
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  component="span"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
                  }}
                >
                  {item.food_item}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: getConfidenceBg(item.confidence),
                    color: getConfidenceColor(item.confidence),
                    display: 'flex',
                    alignItems: 'center',
                    height: '24px'
                  }}
                >
                  {item.confidence}% confidence
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.75,
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem'
                }}>
                  <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                  {item.timestamp}
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => toggleExpand(item.id)}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    transform: expandedItems[item.id] ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ScanHistory; 