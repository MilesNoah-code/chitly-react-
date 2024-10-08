import dayjs from 'dayjs';
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

import { DeleteHeader } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { REACT_APP_HOST_URL, CHIT_RECEIPT_DELETE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChitReceiptTableRow({
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

  const ChitReceiptDeleteMethod = (id) => {
    const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_DELETE}${id}`;
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

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const HandleSelectMenu = (from) => {
    setOpen(null);
    if (from === "view") {
      navigate(`/chitreceipt/view/${item.id}`, {
        state: {
          screen: 'view',
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
    if (AlertFrom === "success") {
      window.location.reload();
    }
  };

  const HandleConfirmYesClick = () => {
    setOpen(null);
    setConfirmAlert(false);
    ChitReceiptDeleteMethod(item.id);
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
          <TableCell sx={{ ml: 2 }}>{item.date != null && item.date !== "" ? dayjs(item.date).format('DD-MM-YYYY') : ""}</TableCell>
          <TableCell>{item.receiptno != null && item.receiptno !== "" ? Math.round(item.receiptno) : ""}</TableCell>
          <TableCell component="th" scope="row" >
            <Stack direction="row" alignItems="center" >
              <Typography variant="subtitle2" noWrap>
                {item.groupno}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>{item.membername}</TableCell>

          <TableCell>{item.tktno}</TableCell>
          <TableCell>{item.installfrom}  - {item.installto}</TableCell>
          <TableCell align="right">{item.credit_value != null && item.credit_value !== "" ? formatNumber(Math.round(item.credit_value)) : ""}</TableCell>

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
        <MenuItem onClick={() => HandleSelectMenu("view")} sx={{ cursor: 'pointer' }}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => setConfirmAlert(true)} sx={{ color: 'error.main', cursor: 'pointer' }}>
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
          Are you sure you want to delete this Chit Receipt ?
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

ChitReceiptTableRow.propTypes = {
  key: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  item: PropTypes.object
};
