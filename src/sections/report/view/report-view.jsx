import dayjs from 'dayjs';
import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Tab, Stack, Alert, Table, Button, Snackbar, TableRow, TableCell, TableBody, Typography, TableContainer, TablePagination } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { REACT_APP_HOST_URL, PAYABLE_REPORT_LIST, RECEIVABLE_REPORT_LIST } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';
import TableHeader from 'src/sections/member/table-head';
import TableNoData from 'src/sections/member/table-no-data';
import TableEmptyRows from 'src/sections/member/table-empty-rows';

import './report-view.css';

export default function ReportView() {

    const navigate = useNavigate();
    const [TabIndex, setTabIndex] = useState('1');
    const Session = localStorage.getItem('apiToken');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [PayableReportList, setPayableReportList] = useState([]);
    const [PayableReportLoading, setPayableReportLoading] = useState(true);
    const [TotalCount, setTotalCount] = useState(0);
    const [page1, setPage1] = useState(0);
    const [rowsPerPage1, setRowsPerPage1] = useState(15);
    const [ReceivableReportList, setReceivableReportList] = useState([]);
    const [ReceivableReportLoading, setReceivableReportLoading] = useState(true);
    const [TotalCount1, setTotalCount1] = useState(0);
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
    const [FromDate1, setFromDate1] = useState({
        data: null,
        searchdata: "",
    });
    const [ToDate1, setToDate1] = useState({
        data: null,
        searchdata: "",
    });
    
    useEffect(() => {
        GetPayableReportList(FromDate.searchdata, ToDate.searchdata, page * rowsPerPage, rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, FromDate, ToDate]);

    useEffect(() => {
        GetReceivableReportList(FromDate1.searchdata, ToDate1.searchdata, page1 * rowsPerPage1, rowsPerPage1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page1, rowsPerPage1, FromDate1, ToDate1]);

    const GetPayableReportList = (fromdate, todate, start, limit) => {
        setPayableReportLoading(true);
        setTotalCount(0);
        setPayableReportList([]);
        const url = `${REACT_APP_HOST_URL}${PAYABLE_REPORT_LIST}fromDate=${fromdate}&toDate=${todate}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setPayableReportLoading(false);
                if (json.success) {
                    setTotalCount(json.total);
                    setPayableReportList([...PayableReportList, ...json.list]);
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
                setPayableReportLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetReceivableReportList = (fromdate, todate, start, limit) => {
        setReceivableReportLoading(true);
        setTotalCount1(0);
        setPayableReportList([]);
        const url = `${REACT_APP_HOST_URL}${RECEIVABLE_REPORT_LIST}fromDate=${fromdate}&toDate=${todate}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setReceivableReportLoading(false);
                if (json.success) {
                    setTotalCount1(json.total);
                    setReceivableReportList([...ReceivableReportList, ...json.list]);
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
                setReceivableReportLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const handleSort = (event, id) => {
        
    };

    const handleSelectAllClick = (event) => {
        
    };

    const handleChangePage = (newPage, from) => {
        if (from === "") {
            setPage(newPage);
        } else {
            setPage1(newPage);
        }
    };

    const handleChangeRowsPerPage = (event, from) => {
        if (from === "PayableReportList"){
            setPage(0);
            setTotalCount(0);
            setPayableReportList([]);
            setRowsPerPage(parseInt(event.target.value, 10));
        }else{
            setPage1(0);
            setTotalCount1(0);
            setReceivableReportList([]);
            setRowsPerPage1(parseInt(event.target.value, 10));
        }
    };

    const HandleFromDateChange = (date, from) => {
        const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
        // console.log('Date to search:', DateForSearch);
        if (from === "PayableReportList"){
            setPage(0);
            setTotalCount(0);
            setPayableReportList([]);
            setFromDate({
                data: date,
                searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
            });
        }else{
            setPage1(0);
            setTotalCount1(0);
            setReceivableReportList([]);
            setFromDate1({
                data: date,
                searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
            });
        } 
    };

    const HandleToDateChange = (date, from) => {
        const DateForSearch = date ? dayjs(date).format('YYYY-MM-DD') : "";
        console.log('Date to search:', DateForSearch);
        if (from === "PayableReportList") {
            setPage(0);
            setTotalCount(0);
            setPayableReportList([]);
            setToDate({
                data: date,
                searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
            });
        } else {
            setPage1(0);
            setTotalCount1(0);
            setReceivableReportList([]);
            setToDate1({
                data: date,
                searchdata: DateForSearch === "Invalid Date" || DateForSearch === undefined || DateForSearch === null ? "" : DateForSearch
            });
        }
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            // window.location.reload();
        }
    };

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const HandleBack = () => {
        navigate('/'); 
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 2, mb: 2 }}>
                    Report
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box component="form"
                    sx={{ '& .MuiTextField-root': {  width: '20ch', }, }}
                    noValidate
                    autoComplete="off">
                    <Stack direction='column'>
                        <TabContext value={TabIndex}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example"
                                    variant="scrollable" scrollButtons="auto">
                                    <Tab label="Payable Report" value="1" />
                                    <Tab label="Receivable Report" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Stack mb={2} mr={3} direction="row" alignItems="center" gap='40px' className='mbl-view'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']} >
                                            <DatePicker
                                                label="From Date"
                                                value={FromDate.data}
                                                onChange={(date) => HandleFromDateChange(date, "PayableReportList")}
                                                disabled={PayableReportLoading}
                                                format="DD-MM-YYYY" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="To Date"
                                                value={ToDate.data}
                                                onChange={(date) => HandleToDateChange(date, "PayableReportList")}
                                                disabled={PayableReportLoading}
                                                format="DD-MM-YYYY" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Stack>
                                {PayableReportLoading
                                    ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                    </Stack>
                                    : <Stack>
                                        <Scrollbar>
                                            <TableContainer sx={{ overflow: 'unset' }}>
                                                <Table sx={{ minWidth: 800 }}>
                                                    <TableHeader
                                                        order='asc'
                                                        orderBy='name'
                                                        rowCount={PayableReportList.length}
                                                        numSelected={0}
                                                        onRequestSort={handleSort}
                                                        onSelectAllClick={handleSelectAllClick}
                                                        headLabel={[
                                                            { id: 'Created On', label: 'Created On' },
                                                            { id: 'Created By', label: 'Created By' },
                                                            { id: 'Domain', label: 'Domain' },
                                                            { id: 'Description', label: 'Description' },
                                                            { id: 'Type', label: 'Type' },
                                                            { id: 'Amount', label: 'Amount' },
                                                        ]} />
                                                    <TableBody>
                                                        {PayableReportList
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox">
                                                                    <TableCell>{row.created_on ? dayjs(row.created_on).format('DD-MM-YYYY') : ""}</TableCell>
                                                                    <TableCell>{row.username}</TableCell>
                                                                    <TableCell>{row.domain}</TableCell>
                                                                    <TableCell>{row.description}</TableCell>
                                                                    <TableCell>{row.type}</TableCell>
                                                                    <TableCell>{row.amount != null && row.amount !== "" ? Math.round(row.amount) : ""}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        <TableEmptyRows
                                                            height={77}
                                                            emptyRows={emptyRows(page, rowsPerPage, PayableReportList.length)}
                                                        />
                                                        {PayableReportList.length === 0 && <TableNoData query="" />}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Scrollbar>
                                        {PayableReportList.length > 0 && <TablePagination
                                            page={page}
                                            component="div"
                                            count={TotalCount}
                                            rowsPerPage={rowsPerPage}
                                            onPageChange={(e) => handleChangePage(e, "PayableReportList")}
                                            rowsPerPageOptions={[15, 30, 50]}
                                            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, "PayableReportList")}
                                        />}
                                    </Stack>}
                            </TabPanel>
                            <TabPanel value="2">
                                <Stack mb={2} mr={3} direction="row" alignItems="center" gap='40px' className='mbl-view'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']} >
                                            <DatePicker
                                                label="From Date"
                                                value={FromDate1.data}
                                                onChange={(date) => HandleFromDateChange(date, "ReceivableReportList")}
                                                disabled={ReceivableReportLoading}
                                                format="DD-MM-YYYY" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="To Date"
                                                value={ToDate1.data}
                                                onChange={(date) => HandleToDateChange(date, "ReceivableReportList")}
                                                disabled={ReceivableReportLoading}
                                                format="DD-MM-YYYY" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Stack>
                                {ReceivableReportLoading
                                    ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                    </Stack>
                                    : <Stack>
                                        <Scrollbar>
                                            <TableContainer sx={{ overflow: 'unset' }}>
                                                <Table sx={{ minWidth: 800 }}>
                                                    <TableHeader
                                                        order='asc'
                                                        orderBy='name'
                                                        rowCount={ReceivableReportList.length}
                                                        numSelected={0}
                                                        onRequestSort={handleSort}
                                                        onSelectAllClick={handleSelectAllClick}
                                                        headLabel={[
                                                            { id: 'Created On', label: 'Created On' },
                                                            { id: 'Created By', label: 'Created By' },
                                                            { id: 'Domain', label: 'Domain' },
                                                            { id: 'Description', label: 'Description' },
                                                            { id: 'Amount', label: 'Amount' },
                                                        ]} />
                                                    <TableBody>
                                                        {ReceivableReportList
                                                            .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                                                            .map((row) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox">
                                                                    <TableCell>{row.created_on ? dayjs(row.created_on).format('DD-MM-YYYY') : ""}</TableCell>
                                                                    <TableCell>{row.username}</TableCell>
                                                                    <TableCell>{row.domain}</TableCell>
                                                                    <TableCell>{row.description}</TableCell>
                                                                    <TableCell>{row.amount != null && row.amount !== "" ? Math.round(row.amount) : ""}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        <TableEmptyRows
                                                            height={77}
                                                            emptyRows={emptyRows(page1, rowsPerPage1, ReceivableReportList.length)}
                                                        />
                                                        {ReceivableReportList.length === 0 && <TableNoData query="" />}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Scrollbar>
                                        {ReceivableReportList.length > 0 && <TablePagination
                                            page={page1}
                                            component="div"
                                            count={TotalCount1}
                                            rowsPerPage={rowsPerPage1}
                                            onPageChange={(e) => handleChangePage(e, "ReceivableReportList")}
                                            rowsPerPageOptions={[15, 30, 50]}
                                            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, "ReceivableReportList")}
                                        />}
                                    </Stack>}
                            </TabPanel>
                        </TabContext>
                    </Stack>
                </Box>
            </Card>
            <Snackbar open={AlertOpen} autoHideDuration={1000} onClose={HandleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
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
