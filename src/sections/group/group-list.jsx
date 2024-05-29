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
import { Button, Dialog, DialogTitle, DialogActions, } from '@mui/material';

import { DeleteHeader } from 'src/hooks/AxiosApiFetch';

import { GROUP_DELETE, REACT_APP_HOST_URL } from 'src/utils/api-constant';

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
  const [Alert, setAlert] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('network');

  const GroupDeleteMethod = (id) => {
    const url = REACT_APP_HOST_URL + GROUP_DELETE + id;
    console.log(url);
    console.log(Session);
    fetch(url, DeleteHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        if (json.success) {
          setAlertMessage(json.message);
          setAlertFrom("success");
          HandleAlertShow();
        } else if (json.success === false) {
          setAlertMessage(json.message);
          setAlertFrom("failed");
          HandleAlertShow();
        } else {
          setErrorAlert(true);
          setErrorScreen("network");
        }
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorScreen("error");
        console.log(error);
      })
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const HandleSelectMenu = (from) => {
    console.log(item)
    setOpen(null);
    if (from === "view") {
      navigate('/addGroup', {
        state: {
          screen: 'view',
          data: item,
        },
      });
    } else if (from === "edit") {
      navigate('/addGroup', {
        state: {
          screen: 'edit',
          data: item,
        },
      });
    }
  };

  const HandleAlertShow = () => {
    setAlert(true);
  };

  const HandleAlertClose = () => {
    setAlert(false);
    if (AlertFrom === "success") {
      window.location.reload();
    }
  };

  const HandleConfirmYesClick = () => {
    setOpen(null);
    setConfirmAlert(false);
    GroupDeleteMethod(item.id);
  };

  const HandleConfirmNoClick = () => {
    setOpen(null);
    setConfirmAlert(false);
  };

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

          <TableCell>{item.amount}</TableCell>

          <TableCell align="right">
            <IconButton onClick={handleOpenMenu}>
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
        <MenuItem onClick={() => HandleSelectMenu("view")} sx={{ display: 'none' }}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => HandleSelectMenu("edit")}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => setConfirmAlert(true)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog
        open={ConfirmAlert}
        onClose={HandleAlertClose}
        maxWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to delete this Group ?
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={HandleConfirmYesClick}>
            Yes
          </Button>
          <Button onClick={HandleConfirmNoClick} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Alert}
        onClose={HandleAlertClose}
        fullWidth={500}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        <IconButton
          aria-label="close"
          onClick={HandleAlertClose}
          sx={{ position: 'absolute', right: 15, top: 20, color: (theme) => theme.palette.grey[500], }} >
          <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
        </IconButton>
        <Stack style={{ alignItems: 'center', }} mt={5}>
          {AlertFrom === "success"
            ? <img src="../../../public/assets/icons/success_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />
            : <img src="../../../public/assets/icons/failed_gif.gif" alt="Loading" style={{ width: 130, height: 130, }} />}
          <Typography gutterBottom variant='h4' mt={2} mb={5} color={AlertFrom === "success" ? "#45da81" : "#ef4444"}>
            {AlertMessage}
          </Typography>
        </Stack>
      </Dialog>
    </>
  );
}

GroupTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
