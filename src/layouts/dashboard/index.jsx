import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './index.css';
import Main from './main';
import { HEADER } from './config-layout';
import navConfig from './config-navigation';
import AccountPopover from './common/account-popover';

export default function DashboardLayout({ children }) {
  const themes = useTheme();
  const upLg = useResponsive('up', 'lg');
  const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Changed state name for clarity
  const lgUp = useResponsive('up', 'lg');

  const handleMouseEnter = () => {
    if (!isClicked) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      setIsHovered(false);
    }
  };

  const handleIconClick = () => {
    setIsClicked(!isClicked);
    setIsHovered(false); // Ensure hover state is reset when clicked
  };

  const renderAccount = (
    <Box
      sx={{ my: 2, py: '10px', px: 1.5, display: 'flex', borderRadius: 1.5, alignItems: 'center', backgroundColor: 'yellow',
        bgcolor: (theme) => isClicked || isHovered ? alpha(theme.palette.grey[500], 0.12) : alpha(theme.palette.grey[500], 0),
      }} >
      <Avatar
        src={UserDetail.photoURL}
        alt={UserDetail.first_name}
        sx={{
          ...(isClicked || isHovered && {  width: 40, height: 40, }),
        }} >
        {UserDetail.first_name[0]}
      </Avatar>

      <Box sx={{ ml: 2, flexDirection: 'row' }}>
        <Typography variant="subtitle2">{(UserDetail.first_name !== null && UserDetail.first_name !== undefined) ? UserDetail.first_name : ''}</Typography>
        <Typography variant="subtitle2">{(UserDetail.last_name !== null && UserDetail.last_name !== undefined) ? UserDetail.last_name : ''}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'none' }}>
          {UserDetail.role_id}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item, index) => (
        <NavItem key={item.title} item={item} isFirstItem={index === 0} onMouseEnter={handleMouseEnter} onClick={handleIconClick} />
      ))}
    </Stack>
  );

  const renderMenuContent = (
    <Scrollbar
      sx={{ height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column', }, }} >

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderHeaderContent = (
    <>
      <Stack>
        <div className='box-logo'>
          <img className="logo-chitly" src="/assets/images/img/chit.png" alt="Loading" />
        </div>
      </Stack>
      {!lgUp && (<IconButton onClick={handleIconClick} sx={{ mr: 2, }}>
        <Iconify icon="eva:menu-2-fill" style={{ width: '25px', height: '25px' }} />
      </IconButton>)}
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <>
      <AppBar className="custom-header"
        sx={{ boxShadow: 'none', height: HEADER.H_MOBILE, zIndex: themes.zIndex.appBar + 1,
          ...bgBlur({ color: themes.palette.background.default, }),
          transition: themes.transitions.create(['height'], { duration: themes.transitions.duration.shorter, }),
          ...(lgUp && { width: `calc(100% - ${1}px)`, height: HEADER.H_DESKTOP, }),
        }} >
        <Toolbar
          sx={{ height: 1, px: { lg: 5 }, justifyContent: 'space-between', }} >
          {renderHeaderContent}
        </Toolbar>
      </AppBar>

      <Box
        sx={{ position: 'relative', minHeight: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, }} >
        <Box
          sx={{ flexShrink: { lg: 0 }, width: { lg: isClicked || isHovered ? '280px' : '55px' }, backgroundColor: 'white',
            transition: 'width 0.3s ease-in-out', zIndex: 1200, // Ensure the Nav drawer appears above other content
            '&:hover': { width: isClicked || isHovered ? '280px' : '55px', // Maintain expanded width on hover if clicked
            }, }} onMouseLeave={handleMouseLeave} >
          {upLg ?
            <Box
              sx={{ height: 1, position: 'fixed', width: isClicked || isHovered ? '280px' : '55px',
                transition: 'width 0.3s ease-in-out',
                '&:hover': { width: '270px', zIndex: 9999999, backgroundColor: 'white', },
                borderRight: (theme) => `dashed 1px ${theme.palette.divider}`, }} >
              {renderMenuContent}
            </Box>
            : <Drawer
              open={isClicked}
              onClose={handleIconClick}
              PaperProps={{
                sx: { transition: 'width 0.3s ease-in-out', width: '280px', padding: '0 16px', zIndex: 100,
                  position: 'absolute', top: 0, right: 0, height: '100%', }, }} >
              {renderMenuContent}
            </Drawer>}
        </Box>

        <Main  className="main-div" sx={{px:'0px'}}>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};


function NavItem({ item, isFirstItem, onMouseEnter, onClick }) {

  const lgUp = useResponsive('up', 'lg');
  const location = useLocation();

  // Check if the current path starts with the nav item path
  // const active = location.pathname.startsWith(item.path) || (isFirstItem && pathname === '/');
  const replaceDynamicPath = (path) => path
    .replace(':memberId', '')
    .replace(':groupId', '')
    .replace(':receiptId', '')
    .replace(':paymentId', '');

  const active = location.pathname === item.path ||
    location.pathname.startsWith(`${item.path}/`) ||
    (item.subItems && item.subItems.some(subItem => {
      const subItemPath = replaceDynamicPath(subItem.path);
      return location.pathname.includes(subItemPath);
    })) || (isFirstItem && location.pathname === '/');
    // console.log(active)

  return (
    <ListItemButton
      component={RouterLink}
      onClick={!lgUp && onClick}
      to={item.path}
      sx={{
        display: 'flex', alignItems: 'center', minHeight: 44, borderRadius: 0.75, typography: 'body2',
        color: 'text.secondary', textTransform: 'capitalize', fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main', fontWeight: 'fontWeightSemiBold', backgroundColor: 'white',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16), },
        }),
        position: 'relative', overflow: 'hidden', transition: 'min-width 0.3s ease-in-out',
        minWidth: '280px', padding: '0 16px',
        '&:hover': {
          '& .navItemIcon': { width: '18px', },
        },
      }} onMouseEnter={onMouseEnter} >
      <Box
        component="span"
        className="navItemIcon"
        sx={{ width: '24px', height: '24px', mr: 2, ml: -2, transition: 'width 0.3s ease-in-out', }} >
        {item.icon}
      </Box>

      {/* Title */}
      <Box
        component="span"
        className="navItemTitle"
        sx={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
          transition: 'max-width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
        }} >
        {item.title}
      </Box>
    </ListItemButton>
  );
}


NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  isFirstItem: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};