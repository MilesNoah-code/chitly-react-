import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import './header.css';
import { HEADER } from './config-layout';
import AccountPopover from './common/account-popover';
// import LanguagePopover from './common/language-popover';
// import NotificationsPopover from './common/notifications-popover';

export default function Header({ onOpenNav }) {
  const theme = useTheme();

   const lgUp = useResponsive('up', 'lg');
  
   
  const renderContent = (
    <>
    <Stack>
    <div className='box-logo'>
    <img className="logo-chitly" src="/assets/images/img/chitly_logo.png" alt="Loading"  />
    </div>
    </Stack>
   
    <IconButton onClick={onOpenNav} sx={{ mr:2, display: 'none' }}>
    <Iconify icon="eva:menu-2-fill" />
  </IconButton>

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <LanguagePopover />
        <NotificationsPopover /> */}
        <AccountPopover />
        
      </Stack>
    </>
  );

  return (
    <AppBar  className="custom-header"
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: 'white',
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          justifyContent: 'space-between',
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
