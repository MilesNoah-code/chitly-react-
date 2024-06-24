import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { PostHeader } from 'src/hooks/AxiosApiFetch';
import { useResponsive } from 'src/hooks/use-responsive';

import { LOGOUT_URL, REACT_APP_HOST_URL } from 'src/utils/api-constant';

// import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

export default function Nav({ openNav, onCloseNav }) {
  const location = useLocation();
  const upLg = useResponsive('up', 'lg');
  const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const Session = localStorage.getItem('apiToken');
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);

  const LogOutMethod = () => {
    setLoading(true);
    const url = `${REACT_APP_HOST_URL}${LOGOUT_URL}`;
    // console.log(JSON.parse(Session)  + url);
    fetch(url, PostHeader(JSON.parse(Session), ''))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setLoading(false);
        if (json.success) {
          localStorage.removeItem("apiToken");
          localStorage.removeItem("userDetails");
          navigate('/login');
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
      });
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, openNav, onCloseNav]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={UserDetail.photoURL} alt={UserDetail.first_name} >
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
        <NavItem key={item.title} item={item} isFirstItem={index === 0} />
      ))}
    </Stack>
  );

  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
        <Button
          target="_blank"
          variant="contained"
          color="inherit"
          onClick={Loading ? null : LogOutMethod} >
          {Loading
            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
            : ("Logout")}
        </Button>
      </Stack>
    </Box>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack>
        <img src="/assets/images/img/chitly_logo.png" alt="Loading" style={{ width: 170, height: 80, marginTop: 20, marginLeft: 20 }} />
      </Stack>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {renderUpgrade}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
        backgroundColor: 'white',
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item, isFirstItem }) {
  const pathname = usePathname();
  const location = useLocation();
  const active = location.pathname.startsWith(item.path) || (isFirstItem && pathname === '/');

  return (
    <ListItemButton
      component={RouterLink}
      to={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          backgroundColor: 'white',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>
      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  isFirstItem: PropTypes.bool
};
