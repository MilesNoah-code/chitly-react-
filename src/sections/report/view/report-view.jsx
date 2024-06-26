import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import { Box, Tab, Stack, Alert, Table, Button, Dialog, Snackbar, TableRow, TableCell, TableBody, TextField, Typography, TableContainer, InputAdornment, TablePagination } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { REACT_APP_HOST_URL, PAYABLE_REPORT_LIST, RECEIVABLE_REPORT_LIST } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
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
    const [GroupNoSearch, setGroupNoSearch] = useState('');
    const [GroupNoSearch1, setGroupNoSearch1] = useState('');
    const [InstallmentDetailList, setInstallmentDetailList] = useState([]);
    const [InstallmentDetailListAlert, setInstallmentDetailListAlert] = useState(false);
    
    useEffect(() => {
        GetPayableReportList(GroupNoSearch, page * rowsPerPage, rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, GroupNoSearch]);

    useEffect(() => {
        GetReceivableReportList(GroupNoSearch1, page1 * rowsPerPage1, rowsPerPage1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page1, rowsPerPage1, GroupNoSearch1]);

    const GetPayableReportList = (groupno, start, limit) => {
        setPayableReportLoading(true);
        setTotalCount(0);
        setPayableReportList([]);
        const url = `${REACT_APP_HOST_URL}${PAYABLE_REPORT_LIST}${groupno}&start=${start}&limit=${limit}`;
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

    const GetReceivableReportList = (groupno, start, limit) => {
        setReceivableReportLoading(true);
        setTotalCount1(0);
        setReceivableReportList([]);
        const url = `${REACT_APP_HOST_URL}${RECEIVABLE_REPORT_LIST}${groupno}&start=${start}&limit=${limit}`;
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

    const handleFilterByGroupNo = (event, from) => {
        if (from === "PayableReportList") {
            setPage(0);
            setTotalCount(0);
            setPayableReportList([]);
            setGroupNoSearch(event.target.value);
        } else {
            setPage1(0);
            setTotalCount1(0);
            setReceivableReportList([]);
            setGroupNoSearch1(event.target.value);
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
                                <Stack mb={2} mr={3} direction="row" alignItems="center" gap='30px' className='mbl-view'>
                                    <TextField
                                        placeholder="Search Group..."
                                        value={GroupNoSearch}
                                        onChange={(e) => handleFilterByGroupNo(e, "PayableReportList")}
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
                                                            { id: 'S.No', label: 'S.No' },
                                                            { id: 'Customer Name', label: 'Customer Name' },
                                                            { id: 'Acc No', label: 'Acc No' },
                                                            { id: 'Group No', label: 'Group No' },
                                                            { id: 'Ticket No', label: 'Ticket No' },
                                                            { id: 'Total Amount', label: 'Total Amount' },
                                                        ]} />
                                                    <TableBody>
                                                        {PayableReportList
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map((row, index) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox">
                                                                    <TableCell>{(index+1)}</TableCell>
                                                                    <TableCell>{row.memberName}</TableCell>
                                                                    <TableCell>{row.memberId}</TableCell>
                                                                    <TableCell>{row.groupno}</TableCell>
                                                                    <TableCell>{row.tktno}</TableCell>
                                                                    <TableCell>{row.chitAmount != null && row.chitAmount !== "" ? Math.round(row.chitAmount) : ""}</TableCell>
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
                                    <TextField
                                        placeholder="Search Group..."
                                        value={GroupNoSearch1}
                                        onChange={(e) => handleFilterByGroupNo(e, "ReceivableReportList")}
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
                                                            { id: 'S.No', label: 'S.No' },
                                                            { id: 'Customer Name', label: 'Customer Name' },
                                                            { id: 'Acc No', label: 'Acc No' },
                                                            { id: 'Group No', label: 'Group No' },
                                                            { id: 'Ticket No', label: 'Ticket No' },
                                                            { id: 'Amount Pending', label: 'Amount Pending' },
                                                            { id: 'Action', label: 'Action' },
                                                        ]} />
                                                    <TableBody>
                                                        {ReceivableReportList
                                                            .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                                                            .map((row, index) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox">
                                                                    <TableCell>{(index+1)}</TableCell>
                                                                    <TableCell>{row.memberName}</TableCell>
                                                                    <TableCell>{row.memberId}</TableCell>
                                                                    <TableCell>{row.groupNo}</TableCell>
                                                                    <TableCell>{row.tktno}</TableCell>
                                                                    <TableCell>{row.arrears != null && row.arrears !== "" ? Math.round(row.arrears) : ""}</TableCell>
                                                                    <TableCell>
                                                                        <IconButton onClick={() => { setInstallmentDetailList(row.detail); setInstallmentDetailListAlert(true); }} sx={{ cursor: 'pointer' }}>
                                                                            <Iconify icon="eva:eye-fill" />
                                                                        </IconButton>
                                                                    </TableCell>
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
            <Dialog
                open={InstallmentDetailListAlert}
                fullWidth={false}  // Set fullWidth to false to control width manually
                maxWidth="md"      // Set maxWidth to limit the width
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <Card sx={{ width: 300 }}> {/* Adjust Card width */}
                    <Stack>
                        <Stack mt={2} ml={2} mr={1} direction="row" alignItems="center">
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={() => setInstallmentDetailListAlert(false)}
                                sx={{ position: 'absolute', right: 2, top: 0, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}>
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17 }} />
                            </IconButton>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{ mt: 2 }}>
                                <Table sx={{ minWidth: 300 }} stickyHeader>
                                    <TableHeader sx={{ width: '100%' }}
                                        order="asc"
                                        orderBy="name"
                                        rowCount={InstallmentDetailList.length}
                                        numSelected={InstallmentDetailList.length}
                                        onRequestSort={handleSort}
                                        onSelectAllClick={handleSelectAllClick}
                                        headLabel={[
                                            { id: 'Installment No', label: 'Installment No' },
                                            { id: 'Amount', label: 'Amount' },
                                        ]} />
                                    <TableBody>
                                        {InstallmentDetailList.map((row, index) => (
                                            <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                <TableCell>{row.installno}</TableCell>
                                                <TableCell>{row.amount != null && row.amount !== "" ? Math.round(row.amount) : ""}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableEmptyRows
                                            height={77}
                                            emptyRows={emptyRows(page, 5, InstallmentDetailList.length)} />
                                        {InstallmentDetailList.length === 0 && <TableNoData query="" />}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
        </Container>
    );
}
