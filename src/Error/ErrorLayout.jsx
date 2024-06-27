import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Button, Typography } from '@mui/material';

const ErrorLayout = ({ screen }) => {
  const HandleRetry = () => {
    window.location.reload();
  };
  return(
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
        {screen === "network"
          ? <img src="/assets/images/img/network_alert.gif" alt="Loading" style={{ width: 100, height: 80, }} />
          : <div className='reload-img' style={{ width: 350, height: 130, }}><img src="/assets/images/img/reload.png" alt="Loading" style={{width:'100%',height:'100%'}} /></div>}
      </Stack>
      <Typography variant="h6" gutterBottom mb={3} mt={5} color={screen === "network" ? "#1da1f2" :"#ef4444"} sx={{ color: "#000000" }}>
        {screen === "network" ? "Error in Network, Try Again" : "Oops! Something went wrong."}
      </Typography>
      
      <Button variant="contained" color="primary" onClick={HandleRetry} 
        sx={{
            backgroundColor: '#257ff1',
            '&:hover': {
              backgroundColor: '#1e6ed9', // darker shade of #257ff1 for hover effect
            },
          }}
      >
        Reload
      </Button>
    </Box>
  );
};

export default ErrorLayout;

ErrorLayout.propTypes = {
  screen: PropTypes.any,
};