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
          ? <img src="../../public/assets/images/img/network_alert.gif" alt="Loading" style={{ width: 100, height: 80, }} />
          : <img src="../../public/assets/images/img/error_alert.gif" alt="Loading" style={{ width: 80, height: 80, }} />}
      </Stack>
      <Typography variant="h4" gutterBottom mb={5} mt={1} color={screen === "network" ? "#1da1f2" :"#ef4444"}>
        {screen === "network" ? "Error in Network, Try Again" : "Oops! Something went wrong."}
      </Typography>
      
      <Button variant="contained" color="primary" onClick={HandleRetry} 
        sx={{
          backgroundColor: screen === "network" ? '#1da1f2' : '#ef4444',
          '&:hover': {
            backgroundColor: screen === "network" ? '#1da1f2' : '#ef4444',
          },
        }}>
        Reload
      </Button>
    </Box>
  );
};

export default ErrorLayout;

ErrorLayout.propTypes = {
  screen: PropTypes.any,
};