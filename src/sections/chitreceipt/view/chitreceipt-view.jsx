import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Alert, Snackbar, TableRow, TableCell, TextField, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { CHIT_RECEIPT_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitreceipt-view.css';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import ChitReceiptTableRow from '../chitreceipt-list';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ChitReceiptView() {

  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [ChitReceiptList, setChitReceiptList] = useState([]);
  const [ChitReceiptLoading, setChitReceiptLoading] = useState(true);
  const [AlertOpen, setAlertOpen] = useState(false);
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
  const [TotalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(0);
    setChitReceiptList([]);
    GetChitReceiptList(FromDate.searchdata, ToDate.searchdata, filterName, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, FromDate, ToDate, filterName]);

  const GetChitReceiptList = (fromdate, todate, text, start, limit) => {
    setChitReceiptLoading(true);
    setTotalCount(0);
    setChitReceiptList([]);
    const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_LIST}&fromDate=${fromdate}&toDate=${todate}&search=${text}&start=${start}&limit=${limit}`;
    // console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        // console.log(JSON.stringify(json));
        setChitReceiptLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setChitReceiptList([...ChitReceiptList, ...json.list]);
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
        setChitReceiptLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
      })
  }

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
    setTotalCount(0);
    setChitReceiptList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setTotalCount(0);
    setChitReceiptList([]);
    setFilterName(event.target.value);
  };

  const HandleAddChitReceiptClick = () => {
    navigate('/chitreceipt/add', {
      state: {
        screen: 'add',
        data: [],
      },
    });
  }

  const HandleAlertShow = () => {
    setAlertOpen(true);
  };

  const HandleAlertClose = () => {
    setAlertOpen(false);
  };

  const HandleFromDateChange = (date) => {
    const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
    // console.log('Date to search:', DateForSearch);
    setPage(0);
    setTotalCount(0);
    setChitReceiptList([]);
    setFromDate({
      data: date,
      searchdata: DateForSearch
    });
  };

  const HandleToDateChange = (date) => {
    const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
    // console.log('Date to search:', DateForSearch);
    setPage(0);
    setTotalCount(0);
    setChitReceiptList([]);
    setToDate({
      data: date,
      searchdata: DateForSearch
    });
  };

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <div className='chitreceipt-list'>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
      <Typography variant="h6" sx={{ fontWeight:'600'}}>Chit Receipt List</Typography>
        <Button variant="contained" className='custom-button'  onClick={HandleAddChitReceiptClick}>
          Add New
        </Button>
      </Stack>
      <Card>

        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='20px' className='mbl-view'>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} >
              <DatePicker
              
                value={FromDate.data}
                onChange={HandleFromDateChange}
                disabled={ChitReceiptLoading}
                format="DD-MM-YYYY" 
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '8px', 
                    fontSize:'14px'
                  },
                  '& .MuiInputAdornment-root': {
                    padding: '8px', 
                  },
                }}/>
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
               
                value={ToDate.data}
                onChange={HandleToDateChange}
                disabled={ChitReceiptLoading}
                format="DD-MM-YYYY" 
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '8px', 
                    fontSize:'14px'
                  },
                  '& .MuiInputAdornment-root': {
                    padding: '8px', 
                  },
                }}/>
            </DemoContainer>
          </LocalizationProvider>
          <TextField
           className="search-text-field"
            placeholder="Search..."
            value={filterName}
            onChange={(e) => handleFilterByName(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="search-icon-adornment">
                  <Iconify
                    icon="eva:search-fill"
                    className="search-icon"
                    sx={{ ml: 0, width: 20, height: 20, color: 'text.disabled' }}
                  
                   />
                </InputAdornment>
              ),
            }}
            sx={{
              paddingTop:'8px',
              '& .MuiInputBase-input': {
                padding: '8px',
                fontSize:'14px' 
              },
              '& .MuiInputAdornment-root': {
                padding: '8px', 
              },
            }} 
          />
        </Stack>
        {ChitReceiptLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack sx={{ paddingLeft: 3, paddingRight: 3 }}>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableRow className='head-table' hover tabIndex={-1}>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Date</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Receipt No</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Group No</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Ticket No</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Inst No</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} align='right'>Credit Amount</TableCell>
                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} className="action" align='right'>Action</TableCell>
                  </TableRow>
                  <TableBody>
                    {ChitReceiptList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <ChitReceiptTableRow
                          key={row.id}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          item={row}
                        />
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, ChitReceiptList.length)}
                    />
                    {ChitReceiptList.length === 0 && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {ChitReceiptList.length > 0 && <TablePagination
              page={page}
              component="div"
              count={TotalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[15, 30, 50]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />}
          </Stack>}
      </Card>
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
    </div>
  );
}

