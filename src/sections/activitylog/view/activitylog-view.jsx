import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Alert, Snackbar, TableRow, TableCell } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { ACTIVITY_LOG_LIST, REACT_APP_HOST_URL } from 'src/utils/api-constant';

import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './activitylog-view.css';
import TableHeader from '../../member/table-head';
import TableNoData from '../../member/table-no-data';
import ErrorLayout from '../../../Error/ErrorLayout';
import TableEmptyRows from '../../member/table-empty-rows';

export default function ActivityLogView() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const Session = localStorage.getItem('apiToken');
  const [ActivityLogList, setActivityLogList] = useState([]);
  const [ActivityLogLoading, setActivityLogLoading] = useState(true);
  const [AlertOpen, setAlertOpen] = useState(false);
  const [AlertMessage, setAlertMessage] = useState('');
  const [AlertFrom, setAlertFrom] = useState('');
  const [ErrorAlert, setErrorAlert] = useState(false);
  const [ErrorScreen, setErrorScreen] = useState('');
  const [TotalCount, setTotalCount] = useState(0);
  const [FromDate, setFromDate] = useState({
    data: null,
    searchdata: "",
  });
  const [ToDate, setToDate] = useState({
    data: null,
    searchdata: "",
  });

  useEffect(() => {
    setTotalCount(0);
    setActivityLogList([]);
    GetActivityLogList(FromDate.searchdata, ToDate.searchdata, page * rowsPerPage, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, FromDate, ToDate]);

  const GetActivityLogList = (fromdate, todate, start, limit) => {
    setActivityLogLoading(true);
    setTotalCount(0);
    setActivityLogList([]);
    const url = `${REACT_APP_HOST_URL}${ACTIVITY_LOG_LIST}fromDate=${fromdate}&toDate=${todate}&start=${start}&limit=${limit}`;
    console.log(JSON.parse(Session) + url);
    fetch(url, GetHeader(JSON.parse(Session)))
      .then((response) => response.json())
      .then((json) => {
        console.log(JSON.stringify(json));
        setActivityLogLoading(false);
        if (json.success) {
          setTotalCount(json.total);
          setActivityLogList([...ActivityLogList, ...json.list]);
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
        setActivityLogLoading(false);
        setErrorAlert(true);
        setErrorScreen("error");
        // console.log(error);
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
      const newSelecteds = ActivityLogList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setTotalCount(0);
    setActivityLogList([]);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

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
    setActivityLogList([]);
    setFromDate({
      data: date,
      searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
    });
  };

  const HandleToDateChange = (date) => {
    const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
    console.log('Date to search:', DateForSearch);
    setPage(0);
    setTotalCount(0);
    setActivityLogList([]);
    setToDate({
      data: date,
      searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
    });
  };

  if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2} >
        <Typography variant="h6" sx={{ color: '#637381' }}>Activity Log List</Typography>
      </Stack>
      <Card>
        <Stack mb={2} mt={2} ml={3} mr={3} direction="row" alignItems="center" gap='40px' className='mbl-view'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']} >
              <DatePicker
                label="From Date"
                value={FromDate.data}
                onChange={HandleFromDateChange}
                disabled={ActivityLogLoading}
                format="DD-MM-YYYY" />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="To Date"
                value={ToDate.data}
                onChange={HandleToDateChange}
                disabled={ActivityLogLoading}
                format="DD-MM-YYYY" />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>
        {ActivityLogLoading
          ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
          </Stack>
          : <Stack>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHeader
                    order={order}
                    orderBy={orderBy}
                    rowCount={ActivityLogList.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'Created On', label: 'Created On' },
                      { id: 'Entry Date', label: 'Entry Date' },
                      { id: 'Created By', label: 'Created By' },
                      { id: 'Domain', label: 'Domain' },
                      { id: 'Description', label: 'Description' },
                      { id: 'Type', label: 'Type' },
                      { id: 'Reference', label: 'Reference' },
                      { id: 'Amount', label: 'Amount' },
                    ]} />
                  <TableBody>
                    {ActivityLogList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover tabIndex={-1} role="checkbox" selected={selected.indexOf(row.name) !== -1}>
                          <TableCell>{row.created_on ? dayjs(row.created_on).format('DD-MM-YYYY') : ""}</TableCell>
                          <TableCell>{row.date ? dayjs(row.date).format('DD-MM-YYYY') : ""}</TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell>{row.domain}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{row.ref_type}</TableCell>
                          <TableCell>{row.amount != null && row.amount !== "" ? Math.round(row.amount) : ""}</TableCell>
                        </TableRow>
                      ))}
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, ActivityLogList.length)}
                    />
                    {ActivityLogList.length === 0 && <TableNoData query="" />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {ActivityLogList.length > 0 && <TablePagination
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
    </Container>
  );
}

