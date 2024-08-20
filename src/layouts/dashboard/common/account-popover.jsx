import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Stack, Alert, Dialog, Snackbar } from '@mui/material';

import { GetHeader, PostHeader } from 'src/hooks/AxiosApiFetch';

import { LOGOUT_URL, CURRENT_USER, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import './account-popover.css';

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  // const UserDetail = JSON.parse(localStorage.getItem('userDetails'));
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const Session = localStorage.getItem('apiToken');
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [UserDetail, setUserDetail] = useState({});

  const handleClose = (option) => {
    setOpen(null);
    if (option.label === "Home"){
      navigate('/');
    } else if (option.label === "Profile") {
      navigate('/');
    }
  };

  useEffect(() => {
    GetUserDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetUserDetail = () => {
    const url = `${REACT_APP_HOST_URL}${CURRENT_USER}`;
    console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          setUserDetail(json.userDetails);
        } else if (json.success === false) {
          if (json.code === 2 || json.code === "2") {
            LogOutMethod();
          } else {
            setAlertMessage(json.message);
            setAlertFrom("failed");
            HandleAlertShow();
          }
        }
      })
      .catch((error) => {
        // console.log(error);
      })
  };

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
    if (AlertFrom === "success") {
      window.location.reload();
    }
  }

  const LogOutMethod = () => {
    setOpen(null);
    setLoading(true);
    const url = `${REACT_APP_HOST_URL}${LOGOUT_URL}`;
    // console.log(JSON.parse(Session) + url)
    fetch(url, PostHeader(JSON.parse(Session), ''))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setLoading(false);
        if (json.success) {
          localStorage.removeItem("apiToken");
          localStorage.removeItem( "userDetails");
          navigate('/login');
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
      })
  }

  const firstName = UserDetail.first_name !== null && UserDetail.first_name !== undefined ? UserDetail.first_name : '';
  const lastName = UserDetail.last_name !== null && UserDetail.last_name !== undefined ? UserDetail.last_name : '';
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={UserDetail.photoURL}
          alt={UserDetail.first_name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {Object.keys(UserDetail).length > 0 ? UserDetail.first_name.charAt(0) : ''}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => handleClose("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {UserDetail.username}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleClose(option)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider className="space-div" sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={LogOutMethod}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
      <Snackbar open={AlertOpen} autoHideDuration={1000} onClose={HandleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
        <Alert
          onClose={HandleAlertClose}
          severity={AlertFrom === "failed" ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }} >
          {AlertMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={Loading}
        onClose={() => setLoading(false)}
        fullWidth={500}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <Stack style={{ alignItems: 'center' }} mt={5} mb={5}>
          <img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
        </Stack>
      </Dialog>
    </>
  );
}
