import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Button, Typography } from '@mui/material';

const ScreenError = ({ HandlePreviousScreen }) => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      bgcolor="background.paper"
      color="text.primary"
    >
      <Stack style={{ flexDirection: 'column' }} alignItems="center" justifyContent="center">
      <div className='reload-img' style={{ width: 300, height: 300, }}><img src="/assets/images/img/screen_error.jpg" alt="Loading" style={{width:'100%',height:'100%'}} /></div>
      </Stack>
      <Typography variant="h6" gutterBottom mb={3} mt={5} color="#1da1f2" sx={{ color: "#000000" }}>
        Error: Missing state data. Please navigate to previous screen.
      </Typography>
      
      <Button variant="contained" color="primary" onClick={HandlePreviousScreen} 
        sx={{
            backgroundColor: '#257ff1',
            '&:hover': {
              backgroundColor: '#1e6ed9', // darker shade of #257ff1 for hover effect
            },
          }}
      >
        Go Back
      </Button>
    </Box>
);

export default ScreenError;

ScreenError.propTypes = {
  HandlePreviousScreen: PropTypes.func,
};