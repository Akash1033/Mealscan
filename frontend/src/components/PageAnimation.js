import React from 'react';
import { Box, Fade } from '@mui/material';

const PageAnimation = ({ children }) => {
  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          width: '100%',
          opacity: 0,
          animation: 'fadeIn 0.8s ease-out forwards',
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
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};

export default PageAnimation; 