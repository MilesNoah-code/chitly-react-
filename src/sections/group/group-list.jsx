import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Alert, Button, Dialog, Snackbar, DialogTitle, DialogActions } from '@mui/material';

import { DeleteHeader, PutHeaderWithoutParams } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { GROUP_DELETE, GROUP_ACTIVATE, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';

export default function GroupTableRow({
  key,
  selected,
  handleClick,
  item,
}) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const Session = localStorage.getItem('apiToken');
  const [ConfirmAlert, setConfirmAlert] = useState(false);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('network');

  const GroupDeleteMethod = (id) => {
    const url = `${REACT_APP_HOST_URL}${GROUP_DELETE}${id}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, DeleteHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          setAlertMessage(json.message);
          setAlertFrom("success");
          HandleAlertShow();
        } else if (json.success === false) {
          if (json.code === 2 || json.code === "2") {
            LogOutMethod(navigate);
          } else {
            setAlertMessage(json.message);
            setAlertFrom("failed");
            HandleAlertShow();
          }
        } else {
          setErrorAlert(true);
          setErrorScreen("network");
        }
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const GroupActivateMethod = (id) => {
    const url = `${REACT_APP_HOST_URL}${GROUP_ACTIVATE}${id}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, PutHeaderWithoutParams(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        if (json.success) {
          setAlertMessage(json.message);
          setAlertFrom("success");
          HandleAlertShow();
        } else if (json.success === false) {
          if (json.code === 2 || json.code === "2") {
            LogOutMethod(navigate);
          } else {
            setAlertMessage(json.message);
            setAlertFrom("failed");
            HandleAlertShow();
          }
        } else {
          setErrorAlert(true);
          setErrorScreen("network");
        }
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const HandleSelectMenu = (from) => {
    setOpen(null);
    if (from === "view") {
      navigate(`/group/view/${item.id}`, {
        state: {
          screen: 'view',
          data: item,
        },
      });
    } else if (from === "edit") {
      navigate(`/group/edit/${item.id}`, {
        state: {
          screen: 'edit',
          data: item,
        },
      });
    }
  };

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
    setConfirmAlert(false);
    if (AlertFrom === "success") {
      window.location.reload();
    }
  };

  const HandleConfirmYesClick = () => {
    setOpen(null);
    setConfirmAlert(false);
    if (item.is_active === 0) {
      GroupActivateMethod(item.id);
    } else {
      GroupDeleteMethod(item.id);
    }
  };

  const HandleConfirmNoClick = () => {
    setOpen(null);
    setConfirmAlert(false);
  };

  const formatNumber = (number) => new Intl.NumberFormat('en-IN').format(number);

  return (
    <>
      {ErrorAlert
        ? <Stack style={{ alignItems: 'center', backgroundColor: 'red', flex: 1 }} mt={5}>
          <ErrorLayout screen={ErrorScreen} />
        </Stack>
        : <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox" style={{ display: 'none' }}>
            <Checkbox disableRipple checked={selected} onChange={handleClick} />
          </TableCell>
          <TableCell sx={{ ml: 2 }}>{item.id}</TableCell>
          <TableCell component="th" scope="row" >
            <Stack direction="row" alignItems="center" >
              <Typography variant="subtitle2" noWrap>
                {item.groupno}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>{item.duration}</TableCell>
          <TableCell>{item.auction_mode}</TableCell>
          <TableCell align='right'>{item.amount != null && item.amount !== "" ? formatNumber(Math.round(item.amount)) : ""}</TableCell>
          <TableCell align="right">
            <IconButton onClick={handleOpenMenu} sx={{ cursor: 'pointer' }}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </TableRow>}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => HandleSelectMenu("close")}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {item.is_active === 1
          ? <MenuItem onClick={() => HandleSelectMenu("edit")} sx={{ cursor: 'pointer' }}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          : <MenuItem onClick={() => HandleSelectMenu("view")} sx={{ cursor: 'pointer' }}>
            <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
            View
          </MenuItem>}
        {item.is_active === 1
          ? <MenuItem onClick={() => setConfirmAlert(true)} sx={{ color: 'error.main', cursor: 'pointer' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
          : <MenuItem onClick={() => setConfirmAlert(true)} sx={{ cursor: 'pointer' }}>
            <img src="/assets/images/img/reactivate.png" alt="Loading" style={{ width: 20, height: 20, marginRight: '15px' }} />
            Activate
          </MenuItem> }
      </Popover>
      <Dialog
        open={ConfirmAlert}
        onClose={HandleAlertClose}
        maxWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <DialogTitle id="responsive-dialog-title">
          {item.is_active === 1 ? "Are you sure you want to delete this Group ?" : "Are you sure you want to activate this Group ?"}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={HandleConfirmYesClick} sx={{ cursor: 'pointer' }}>
            Yes
          </Button>
          <Button onClick={HandleConfirmNoClick} autoFocus sx={{ cursor: 'pointer' }}>
            No
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}

GroupTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
