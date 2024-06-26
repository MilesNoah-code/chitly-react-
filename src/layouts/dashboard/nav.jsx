import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

// import { PostHeader } from 'src/hooks/AxiosApiFetch';
import { useResponsive } from 'src/hooks/use-responsive';

// import { LOGOUT_URL, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import navConfig from './config-navigation';

export default function Nav({ openNav, onCloseNav }) {
  const location = useLocation();
  const upLg = useResponsive('up', 'lg');
  const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  // const Session = localStorage.getItem('apiToken');
  // const navigate = useNavigate();
  // const [Loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // Changed state name for clarity

  /* const LogOutMethod = () => {
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
  }; */

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [location.pathname, openNav, onCloseNav]);

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
      sx={{
        my: 2,
        py: '10px',
        px: 1.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => isClicked || isHovered ? alpha(theme.palette.grey[500], 0.12) : alpha(theme.palette.grey[500], 0),
      }}
    >
      <Avatar
        src={UserDetail.photoURL}
        alt={UserDetail.first_name}
        sx={{
          ...(isClicked || isHovered && {
            width: 40,
            height: 40,
          }),
        }}
      >
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
        <NavItem key={item.title} item={item} isFirstItem={index === 0} onMouseEnter={handleMouseEnter} />
      ))}
    </Stack>
  );

  /* const renderUpgrade = (
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
  ); */

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
      <Box
        sx={{
          mt: 2,
          ml: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={handleIconClick} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
       {/* <img src="/assets/images/img/chitly_logo.png" alt="Loading" style={{ width: 170, height: 80 }} /> */}
      </Box>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {/* renderUpgrade */}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: isClicked || isHovered ? '280px' : '55px' },
        backgroundColor: 'white',
        transition: 'width 0.3s ease-in-out',
        zIndex: 1200, // Ensure the Nav drawer appears above other content
        '&:hover': {
          width: isClicked || isHovered ? '280px' : '55px', // Maintain expanded width on hover if clicked
        },
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* {upLg ?  */}
      <Box
        sx={{
          height: 1,
          position: 'fixed',
          width: isClicked || isHovered ? '280px' : '55px',
          transition: 'width 0.3s ease-in-out',
            '&:hover': {
              width: '270px',
              zIndex: 9999999,
              backgroundColor: 'white',
            },
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {renderContent}
      </Box>
      {/* <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
                transition: 'width 0.3s ease-in-out',
                width: '280px',
                padding: '0 16px',
                zIndex: 100,
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
            },
          }}
        >
          {renderContent}
        </Drawer>} */}
    </Box>
  );
};
Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

function NavItem({ item, isFirstItem, onMouseEnter }) {
  const pathname = usePathname();
  const location = useLocation();
  const active = location.pathname.startsWith(item.path) || (isFirstItem && pathname === '/');

  return (
    <ListItemButton
      component={RouterLink}
      to={item.path}
      sx={{
        display: 'flex',
        alignItems: 'center',
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
        position: 'relative',
        overflow: 'hidden',
        transition: 'min-width 0.3s ease-in-out',
        minWidth: '280px',
        padding: '0 16px',
        '&:hover': {
          '& .navItemIcon': {
            width: '18px', 
          },

        },
      }}
      onMouseEnter={onMouseEnter}
    >
      <Box
        component="span"
        className="navItemIcon"
        sx={{
          width: '24px',
          height: '24px',
          mr: 2, ml:-2,
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {item.icon}
      </Box>

      {/* Title */}
      <Box
        component="span"
        className="navItemTitle"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          transition: 'max-width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
        }}
      >
        {item.title}
      </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  isFirstItem: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
};
