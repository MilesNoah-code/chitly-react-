import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import './index.css';
import Nav from './nav';
import Main from './main';
import Header from './header';


export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <>
      <Header onOpenNav={handleOpenNav} />

      <Box
        sx={{
          position: 'relative',
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={handleCloseNav} />

        <Main  className="main-div" sx={{px:'0px'}}>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
