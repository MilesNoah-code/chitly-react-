import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { Box, Tab, Stack, Alert, Table, Button, Dialog, Divider ,Snackbar, TableRow, TableCell, TableBody, TextField, Typography, TableContainer, InputAdornment } from '@mui/material';

import { GetHeader } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { REACT_APP_HOST_URL, PAYABLE_REPORT_LIST, RECEIVABLE_REPORT_LIST } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';
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
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setPayableReportLoading(false);
                if (json.success) {
                    setTotalCount(json.total);
                    setPayableReportList([...PayableReportList, ...json.list]);
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
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setReceivableReportLoading(false);
                if (json.success) {
                    setTotalCount1(json.total);
                    setReceivableReportList([...ReceivableReportList, ...json.list]);
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
                setReceivableReportLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage);
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

    const formatNumber = (number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2, }).format(number);

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <div style={{ marginLeft: '35px', marginRight: '35px' }} className='report-view'>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 2, mb: 2 }}>
                    Report
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer', display:'none'}}>
                    Back
                </Button>
            </Stack>
            <Card>            
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
                                                <InputAdornment position="start" className="search-icon-adornment">
                                                    <Iconify
                                                        icon="eva:search-fill"
                                                         className="search-icon"
                                                        sx={{ ml: 0, width: 20, height: 20, color: 'text.disabled' }}
                                                       
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize:'14px' },
                                            '& .MuiInputAdornment-root': { padding: '8px', }, }}
                                             className="search-text-field"
                                            />
                                </Stack>
                            {PayableReportLoading
                                ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                    <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                </Stack>
                                : <Stack>
                                    <Scrollbar>
                                        <TableContainer sx={{ overflow: 'unset' }}>
                                            <Table sx={{ minWidth: 800 }} className='rpt-table'>
                                                <TableRow hover tabIndex={-1} className='head-table'>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>S.No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Customer Name</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Acc No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Group No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Ticket No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} align='right'>Total Amount</TableCell>
                                                </TableRow>
                                                <TableBody>
                                                    {PayableReportList
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox">
                                                                <TableCell data-label="S.No" className='table-col1'>
                                                                    <div>{index + 1}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Customer Name" className='table-col2'>
                                                                    <div>{row.memberName}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Acc No" className='table-col1'>
                                                                    <div>{row.memberId}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Group No" className='table-col2'>
                                                                    <div>{row.groupno}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Ticket No" className='table-col1'>
                                                                    <div>{row.tktno}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Total Amount" align='right' className='table-col2 last_cell'>
                                                                    <div>{row.chitAmount != null && row.chitAmount !== "" ? formatNumber(Math.round(row.chitAmount)) : ""}</div>
                                                                </TableCell>
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
                                    {PayableReportList.length > 0 && (
                                        <TablePagination
                                            page={page}
                                            component="div"
                                            className='pagination_cell'
                                            count={TotalCount}
                                            rowsPerPage={rowsPerPage}
                                            onPageChange={handleChangePage}
                                            rowsPerPageOptions={[15, 30, 50]}
                                            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, "PayableReportList")}
                                            labelRowsPerPage={window.innerWidth <= 768 ? "Items per page:" : "Rows per page:"}
                                        />
                                    )}
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
                                            <InputAdornment position="start" sx={{mr:-1}}>
                                                <Iconify
                                                    icon="eva:search-fill"
                                                    sx={{ ml: -1.5, width: 20, height: 20, color: 'text.disabled' }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize:'14px' },
                                    '& .MuiInputAdornment-root': { padding: '8px', }, }}
                                />
                            </Stack>
                            {ReceivableReportLoading
                                ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                    <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                </Stack>
                                : <Stack>
                                    <Scrollbar>
                                        <TableContainer sx={{ overflow: 'unset' }}>
                                            <Table sx={{ minWidth: 800 }} className='rpt-table'>
                                                <TableRow hover tabIndex={-1} className='head-table'>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>S.No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>Customer Name</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>Acc No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>Group No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>Ticket No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }} align='right'>Amount Pending</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }} align='right'>Action</TableCell>
                                                </TableRow>
                                                <TableBody>
                                                    {ReceivableReportList
                                                        .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1)
                                                        .map((row, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={index}>
                                                                <TableCell data-label="S.No" className='table-col1'>
                                                                    <div>{index + 1}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Customer Name" className='table-col2'>
                                                                    <div>{row.memberName}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Acc No" className='table-col1'>
                                                                    <div>{row.memberId}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Group No" className='table-col2'>
                                                                    <div>{row.groupNo}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Ticket No" className='table-col1'>
                                                                    <div>{row.tktno}</div>
                                                                </TableCell>
                                                                <TableCell data-label="Amount Pending" align='right' className='table-col2 last_cell'>
                                                                    <div>{row.arrears != null && row.arrears !== "" ? formatNumber(Math.round(row.arrears)) : ""}</div>
                                                                </TableCell>
                                                                <TableCell align='right' className='action_btn'>
                                                                    <div>
                                                                        <IconButton onClick={() => { setInstallmentDetailList(row.detail); setInstallmentDetailListAlert(true); }} sx={{ cursor: 'pointer' }}>
                                                                            <Iconify icon="eva:eye-fill" />
                                                                        </IconButton>
                                                                    </div>
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
                                        onPageChange={handleChangePage1}
                                        rowsPerPageOptions={[15, 30, 50]}
                                        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, "ReceivableReportList")}
                                    />}
                                </Stack>}
                        </TabPanel>
                    </TabContext>
                </Stack>
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
            <Dialog
                className='report-view'
                open={InstallmentDetailListAlert}
                fullWidth  // Set fullWidth to false to control width manually
                maxWidth="sm"      // Set maxWidth to limit the width
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <Card > {/* Adjust Card width */}
                    <Stack>
                    <Stack ml={1} mr={1} pb={1}direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                    <Stack direction='column'>
                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                          Member List
                        </Typography>
                    </Stack>
                    <IconButton
                    aria-label="close"
                    className='btn-close'
                    onClick={() => setInstallmentDetailListAlert(false)}
                    sx={{ position: 'absolute', right: 12, top: 11, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}>
                    <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14 }} />
                </IconButton>
                </Stack>
                <Divider sx={{ mt: 1, mb:1}}/>
                        <Stack mt={0} ml={1} mr={1} direction="row" alignItems="center">
                        <Scrollbar style={{ maxHeight: '70vh' , width:'100%'}}>
                        <div className='' style={{margin:'15px'}}>
                            <TableContainer sx={{ overflow: 'unset',mt: 1  }}>
                                <Table stickyHeader className='rpt-table'>
                                    <TableRow hover tabIndex={-1} className='head-table'>
                                        <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }}>Inst. No</TableCell>
                                        <TableCell sx={{ background: '#edf4fe', color: '#1877f2' }} align="right">Amount</TableCell>
                                    </TableRow>
                                    <TableBody>
                                        {InstallmentDetailList.map((row, index) => (
                                            <TableRow hover tabIndex={-1} role="checkbox" key={index} sx={{ cursor: 'pointer' }}>
                                                <TableCell data-label="Inst. No" className='table-col'>
                                                    <div>{row.installno}</div>
                                                </TableCell>
                                                <TableCell data-label="Amount" align='right' className='table-col last_cell'>
                                                    <div>{row.amount != null && row.amount !== "" ? formatNumber(Math.round(row.amount)) : ""}</div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableEmptyRows
                                            height={77}
                                            emptyRows={emptyRows(page, 5, InstallmentDetailList.length)} />
                                        {InstallmentDetailList.length === 0 && <TableNoData query="" />}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </div>
                        </Scrollbar>
                    </Stack>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}
