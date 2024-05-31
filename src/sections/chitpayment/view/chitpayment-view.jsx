import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Dialog, TextField, IconButton, InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { CHIT_PAYMENT_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import TableHeader from '../../member/table-head';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import ChitPaymentTableRow from '../chitpayment-list';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ChitPaymentView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Session = localStorage.getItem('apiToken');
  const [ChitPaymentList, setChitPaymentList] = useState([]);
  const [ChitPaymentLoading, setChitPaymentLoading] = useState(true);
  const [Alert, setAlert] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [FromDate, setFromDate] = useState({
    data: null,
    searchdata: "",
  });
  const [ToDate, setToDate] = useState({
    data: null,
    searchdata: "",
  });

  useEffect(() => {
    GetChitPaymentList("", "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetChitPaymentList = (fromdate, todate, text) => {
    setChitPaymentLoading(true);
    const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_LIST}${fromdate}&toDate=${todate}&search=${text}`;
    console.log(url);
    console.log(Session);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        setChitPaymentLoading(false);
        if (json.success) {
          setChitPaymentList(json.list);
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
        setChitPaymentLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        console.log(error);
      })
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ChitPaymentList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    GetChitPaymentList(FromDate.searchdata, ToDate.searchdata, event.target.value);
  };

  const HandleAddChitPaymentClick = () => {
    navigate('/addChitPayment', {
      state: {
        screen: 'add',
        data: [],
      },
    });
  }

  const HandleAlertShow = () => {
    setAlert(true);
  };

  const HandleAlertClose = () => {
    setAlert(false);
  };

  const HandleFromDateChange = (date) => {
    const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
    console.log('Date to search:', DateForSearch);
    setFromDate({
      data: date,
      searchdata: DateForSearch
    });
    GetChitPaymentList(DateForSearch, ToDate.searchdata, filterName);
  };

  const HandleToDateChange = (date) => {
    const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
    console.log('Date to search:', DateForSearch);
    setToDate({
      data: date,
      searchdata: DateForSearch
    });
    GetChitPaymentList(FromDate.searchdata, DateForSearch, filterName);
  };

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
        <Typography variant="h6" sx={{color: '#637381' }}>Chit Payment List</Typography>

        <Button variant="contained"  className='custom-button' startIcon={<Iconify icon="eva:plus-fill" />} onClick={HandleAddChitPaymentClick}>
          Add Chit Payment
        </Button>
      </Stack>
      <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" justifyContent="space-between">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} >
              <DatePicker
                label="From Date"
                value={FromDate.data}
                onChange={HandleFromDateChange}
                disabled={ChitPaymentLoading}
                format="DD-MM-YYYY" />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="To Date"
                value={ToDate.data}
                onChange={HandleToDateChange}
                disabled={ChitPaymentLoading}
                format="DD-MM-YYYY" />
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            placeholder="Search..."
            value={filterName}
            onChange={(e) => handleFilterByName(e)}
            disabled={ChitPaymentLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {ChitPaymentLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHeader
                    order={order}
                    orderBy={orderBy}
                    rowCount={ChitPaymentList.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'Date', label: 'Date' },
                      { id: 'Receipt No', label: 'Receipt No' },
                      { id: 'Group No', label: 'Group No' },
                      { id: 'Member Name', label: 'Member Name' },
                      { id: 'Ticket No', label: 'Ticket No' },
                      { id: 'Inst No', label: 'Inst No' },
                      { id: 'Debit', label: 'Debit' },
                      { id: '' },
                    ]} />
                  <TableBody>
                    {ChitPaymentList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <ChitPaymentTableRow
                          key={row.id}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          item={row}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, ChitPaymentList.length)}
                    />

                    {ChitPaymentList.length === 0 && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={ChitPaymentList.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>}

      </Card>
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
    </Container>
  );
}

