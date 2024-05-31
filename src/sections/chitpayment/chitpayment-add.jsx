import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Button, Dialog, Divider, IconButton, Typography, InputAdornment, } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_RECEIPT_SAVE, REACT_APP_HOST_URL, CHIT_RECEIPT_DETAIL, CHIT_PAYMENT_LEDGER_LIST, CHIT_PAYMENT_UNPAID_GROUP_LIST, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import TableHeader from '../member/table-head';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import ChitPaymentMemberTableRow from './chitpayment-member-list';
import'./chitpayment-add.css';
export default function AddChitPaymentPage() {
   
    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [ReceiptNo, setReceiptNo] = useState({
        data: "",
        error: ""
    });
    const [TicketNo, setTicketNo] = useState({
        data: "",
        error: ""
    });
    const [MemberName, setMemberName] = useState({
        data: screen === "view" ? data : "",
        error: ""
    });
    const [InstallmentNo, setInstallmentNo] = useState({
        data: screen === "view" ? data : "",
        error: ""
    });
    const [AccountNo, setAccountNo] = useState({
        data: "",
        error: ""
    });
    const [MobileNo, setMobileNo] = useState({
        data: "",
        error: ""
    });
    const [Particulars, setParticulars] = useState({
        data: "",
        error: ""
    });
    const [Values, setValues] = useState({
        data: "",
        error: ""
    });
    const [ReceiptDate, setReceiptDate] = useState({
        data: dayjs(),
        datasave: dayjs(dayjs()).format('YYYY-MM-DD'),
        error: ""
    });

    const [Loading, setLoading] = useState(false);
    const [GroupListLoading, setGroupListLoading] = useState(false);
    const [Alert, setAlert] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [UnPaidGroupList, setUnPaidGroupList] = useState([]);
    const [GroupNoSearch, setGroupNoSearch] = useState('');
    const [UnPaidGroupAlert, setUnPaidGroupAlert] = useState(false);
    const [UnPaidGroupLoading, setUnPaidGroupLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [SelectUnPaidGroup, setSelectUnPaidGroup] = useState([]);
    const [filterGroupCode, setfilterGroupCode] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [LedgerListAlert, setLedgerListAlert] = useState(false);
    const [LedgerListLoading, setLedgerListLoading] = useState(true);
    const [LedgerList, setLedgerList] = useState([]);
    const [LedgerTotalCount, setLedgerTotalCount] = useState(0);
    const [LedgerFilterName, setLedgerFilterName] = useState('');
    const [SelectLedgerList, setSelectLedgerList] = useState([]);

    useEffect(() => {
        if (screen === "add") {
            GetUnPaidGroupList("");
            GetLedgerList("", page * rowsPerPage, rowsPerPage);
        } else if (screen === "view") {
            GetChitPaymentView();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen, page, rowsPerPage]);

    const GetChitPaymentView = () => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_DETAIL}${data.id}`;
        console.log(url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setGroupNoSearch(json.list.groupno != null ? json.list.groupno : "");
                    setReceiptNo({
                        data: json.list.receiptno != null ? json.list.receiptno : "",
                        error: ""
                    });
                    setTicketNo({
                        data: json.list.tktno != null ? json.list.tktno : "",
                        error: ""
                    });
                    setAccountNo({
                        data: json.list.accno != null ? json.list.accno : "",
                        error: ""
                    });
                    setMobileNo({
                        data: json.list.installfrom != null ? json.list.installfrom : "",
                        error: ""
                    });
                    setParticulars({
                        data: json.list.installto != null ? json.list.installto : "",
                        error: ""
                    });
                    setValues({
                        data: json.list.credit_value != null ? json.list.credit_value : "",
                        error: ""
                    });
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
                setGroupListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const GetUnPaidGroupList = (groupid) => {
        setUnPaidGroupLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_UNPAID_GROUP_LIST}1&search=${groupid}`;
        console.log(url);
        console.log(Session)
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setUnPaidGroupLoading(false);
                if (json.success) {
                    setUnPaidGroupList(json.list);
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
                setUnPaidGroupLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const GetLedgerList = (text, start, limit) => {
        setLedgerListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_LEDGER_LIST}${text}&start=${start}&limit=${limit}`;
        console.log(url);
        console.log(Session)
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setLedgerListLoading(false);
                if (json.success) {
                    setLedgerList([...LedgerList,...json.list]);
                    setLedgerTotalCount(json.total);
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
                setLedgerListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const ContraLedgerList = SelectLedgerList.map(item => ({
        particular: item.particular,
        account_head_id: item.ledgerdata.id,
        amount: item.value,
        type: item.ledgerdata.reportoption,
        ref_id: item.ledgerdata.ref_id
    }));

    const ChitPaymentInfoParams = {
        "id": 0,
        "branchid": 0,
        "date": ReceiptDate.datasave,
        "groupid": SelectUnPaidGroup.group_id,
        "memberid": SelectUnPaidGroup.member_id,
        "group_member_id": TicketNo.data,
        "tkt_percentage": "100",
        "tkt_suffix": "A",
        "tktno": SelectUnPaidGroup.group_member_id,
        "installment_no": MobileNo.data,
        "particulars": Particulars.data,
        "receiptno": "",
        "cancel": ReceiptNo.data != null ? ReceiptNo.data : "",
        "debit_value": "",
        "note": Values.data,
        "status": 0,
        "comments": 0,
        "is_active": 0,
        "chitContraEntriesForDebit": ContraLedgerList,
    }

    const ChitPaymentAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_SAVE}`;
            Params = ChitPaymentInfoParams;
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
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
                    setLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("error");
                    console.log(error);
                })
        }
    }

    const ChitPaymentTextValidate = (e, from) => {
        const text = e.target.value;
        console.log(from);
        if (from === "ReceiptNo") {
            setReceiptNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "TicketNo") {
            setTicketNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MemberName") {
            setMemberName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "InstallmentNo") {
            setInstallmentNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AccountNo") {
            setAccountNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MobileNo") {
            setMobileNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Particulars") {
            setParticulars(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Values") {
            setValues(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateChitPaymentInfo = () => {
        let IsValidate = true;
        if (!MemberName.data) {
            IsValidate = false;
            setMemberName(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMemberName(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!TicketNo.data) {
            IsValidate = false;
            setTicketNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setTicketNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!ReceiptNo.data) {
            IsValidate = false;
            setReceiptNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setReceiptNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!InstallmentNo.data) {
            IsValidate = false;
            setInstallmentNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstallmentNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MobileNo.data) {
            IsValidate = false;
            setMobileNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMobileNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AccountNo.data) {
            IsValidate = false;
            setAccountNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAccountNo(prevState => ({
                ...prevState,
                error: ""
            }));
        } 
        if (!Values.data) {
            IsValidate = false;
            setValues(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setValues(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Particulars.data) {
            IsValidate = false;
            setParticulars(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setParticulars(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (screen === "add") {
            ChitPaymentAddMethod(IsValidate);
        }
    };

    const HandleAlertShow = () => {
        setAlert(true);
    };

    const HandleAlertClose = () => {
        setAlert(false);
        if (AlertFrom === "success"){
            window.location.reload();
        }
    };

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateChitPaymentInfo();
    };

    const HandleDateChange = (date) => {
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "";
        console.log('Date to save:', DateForSave);
        setReceiptDate({
            data: date,
            datasave: DateForSave,
            error: ""
        });
    };

    const HandleGroupNoSearch = () => {
        console.log("ssss")
        setUnPaidGroupAlert(true);
    }

    const HandleUnPaidGroupAlertClose = () => {
        setUnPaidGroupAlert(false);
    };

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = UnPaidGroupList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, item) => {
        const selectedIndex = selected.indexOf(item.name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item.name);
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
        setSelectUnPaidGroup(item);
        setUnPaidGroupAlert(false);
    };

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
        GetUnPaidGroupList(GroupNoSearch.id);
    };

    const HandleFilterGroupCode = (event) => {
        setPage(0);
        setfilterGroupCode(event.target.value);
        GetUnPaidGroupList(GroupNoSearch.id);
    };

    const HandleCreateLedger = () => {
        console.log("HandleCreateLedger");
        setLedgerListAlert(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const HandleLedgerListAlertClose = () => {
        setLedgerListAlert(false);
    };

    const HandleFilterLedgerName = (event) => {
        setPage(0);
        setLedgerFilterName(event.target.value);
        GetLedgerList(event.target.value, page * rowsPerPage, rowsPerPage);
    };

    const HandleLedgerClick = (event, item) => {
        setSelectLedgerList([...SelectLedgerList,
            {
                name: item.ledgername,
                value: "",
                particular: "",
                ledgerdata: item,
                nameerror: "",
                valueerror: "",
                particularerror: ""
            }
        ]);
        setLedgerListAlert(false);
    };

    const ChitPaymentLedgerTextValidate = (e, item, from) => {
        const text = e.target.value;
        console.log(from);

        setSelectLedgerList(prevState =>
            prevState.map(ledger => {
                if (ledger === item) {
                    if (from === "LedgerName") {
                        return {
                            ...ledger,
                            name: text.trim() !== "" ? text : "",
                            nameerror: text.trim() === "" ? "* Required" : ""
                        };
                    }
                    if (from === "LedgerValues") {
                        return {
                            ...ledger,
                            value: text.trim() !== "" ? text : "",
                            valueerror: text.trim() === "" ? "* Required" : ""
                        };
                    }
                    if (from === "LedgerParticular") {
                        return {
                            ...ledger,
                            particular: text.trim() !== "" ? text : "",
                            particularerror: text.trim() === "" ? "* Required" : ""
                        };
                    }
                }
                return ledger;
            })
        );
    };



    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Chit Payment",
        view: "View Chit Payment",
        edit: "Edit Chit Payment",
    };

    return (
        <Container>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{mt:2, mb:2}}>
               <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screenLabel[screen] || "Add Chit Payment"}
                </Typography>
                <Button variant="contained" className='custom-button'  onClick={() => navigate('/member')}>
                  Back
                </Button>
         </Stack>
            <Card>
                
                <Box  className="con" component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '20ch', },
                    }}
                    noValidate
                    autoComplete="off">
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                               
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Receipt Date
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                    
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']} sx={{ width: 530 }}>
                                     
                                            <DatePicker
                                            className='input-box1'
                                                label="From Date"
                                                value={ReceiptDate.data}
                                                onChange={HandleDateChange}
                                                format="DD-MM-YYYY" />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Stack>
                                  
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{mt: 2, ml: 2 }}>
                                        Group No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0,  }}>
                                        <TextField
                                            className='input-box1'
                                            required
                                            id="outlined-required"
                                            readOnly
                                            label="Group No"
                                            sx={{ pointerEvents: 'auto' }}
                                            value={GroupNoSearch}
                                            onChange={(e) => setGroupNoSearch(e.target.value)}
                                            style={{  }}
                                            onClick={HandleGroupNoSearch} />
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{GroupNoSearch.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Member Name
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled
                                            label="Member Name"
                                            value={MemberName.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "MemberName")}
                                            style={{  }} />
                                      
                                </Stack>
                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{MemberName.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        Ticket No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled
                                            label="Ticket No"
                                            value={TicketNo.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "TicketNo")}
                                            style={{  }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{TicketNo.error}</div>
                                </Stack>
                                </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Receipt No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled
                                            label="Receipt No"
                                            value={ReceiptNo.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "ReceiptNo")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{ReceiptNo.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }}>
                                        Installment No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                        className='input-box1'
                                            required
                                            id="outlined-required"
                                            disabled
                                            label="Installment No"
                                            value={InstallmentNo.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "InstallmentNo")}
                                            style={{  }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{InstallmentNo.error}</div>
                                </Stack>
                                </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Mobile No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled
                                            label="Mobile No"
                                            value={MobileNo.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "MobileNo")}
                                            style={{ }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{MobileNo.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }} >
                                        Account No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled
                                            label="Account No"
                                            value={AccountNo.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "AccountNo")}
                                            style={{ }} />
                                      
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{AccountNo.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                            <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ ml:2, mr: 2, mt: 2, mb: '0px' }}>
                                        Value
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled={screen === "view"}
                                            label="Value"
                                            value={Values.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "Values")}
                                            style={{  }} />
                                     
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{Values.error}</div>
                                </Stack>
                                </div>
                                <div className='box-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{mt: 2, ml: 2 }}>
                                        Particulars
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                        <TextField
                                            required
                                            className='input-box1'
                                            id="outlined-required"
                                            disabled
                                            label="Particulars"
                                            value={Particulars.data}
                                            onChange={(e) => ChitPaymentTextValidate(e, "Particulars")}
                                            style={{  }} />
                                       
                                    </Stack>
                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{Particulars.error}</div>
                                </Stack>
                                </div>
                            </Stack>
                           
                            <Stack direction='column' sx={{ mt: 2 }}>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ ml:2, mt:1}}>
                              
                                    <Typography variant='subtitle1' sx={{ ml:2, mr: 2, mt: 3, mb: '0px' }}>
                                        Ledger Contra Entry Details
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 1, }} onClick={HandleCreateLedger}>
                                        <img src="../../../public/assets/icons/rounded_plus.png" alt="Loading" style={{ width: 25, height: 25, }} />   
                                    </Stack>
                                 
                                </Stack>
                              
                                <Stack>
                                    {SelectLedgerList
                                        .map((row) => (
                                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant='subtitle1' sx={{ ml:2, mr: 2, mt: 3, mb: '0px' }}>
                                                        Name
                                                    </Typography>
                                                    <Stack direction='row' sx={{mt: 0, ml: 0 }}>
                                                        <TextField
                                                            required
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            disabled
                                                            label="Name"
                                                            value={row.name}
                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerName")}
                                                            style={{ }} />
                                                      
                                                    </Stack>
                                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{row.nameerror}</div>
                                                </Stack>
                                                </div>
                                                <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" sx={{ ml: 2, mt: 2 }}>
                                                        Value
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                        <TextField
                                                            required
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            disabled={screen === "view"}
                                                            label="Value"
                                                            value={row.value}
                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerValues")}
                                                            style={{ }} />
                                                     
                                                    </Stack>
                                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{row.valueerror}</div>
                                                </Stack>
                                                </div>
                                                <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant='subtitle1' sx={{ ml:0, mr: 2, mt: 3, mb: '0px' }} >
                                                        Particular
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: -2, }}>
                                                        <TextField
                                                            required
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            disabled={screen === "view"}
                                                            label="Particular"
                                                            value={row.particular}
                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerParticular")}
                                                            style={{  }} />
                                                    
                                                    </Stack>
                                                    <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500" }}>{row.particularerror}</div>
                                                </Stack>
                                                </div>
                                            </Stack>
                                        ))}
                                </Stack>
                            </Stack>
                            {screen === "view"
                                ? null
                                : <Stack direction='column' alignItems='flex-end'>
                                    <Button sx={{ mr: 5, mb: 3, height: 50, width: 150 }} variant="contained" className='custom-button' onClick={HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="../../../public/assets/icons/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                </Stack>}
                        </Stack>}
                </Box>
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
            <Dialog
                open={UnPaidGroupAlert}
                fullWidth
                maxWidth="md"
                sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card sx={{ maxWidth: '800px' }}>
                    <Stack>
                        <Stack mt={4} ml={2} mr={1} direction="row" alignItems="center" >
                            <TextField
                                placeholder="Group Code..."
                                value={filterGroupCode}
                                onChange={(e) => HandleFilterGroupCode(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }} />
                            <TextField
                                placeholder="Member Name..."
                                value={filterName}
                                onChange={(e) => HandleFilterMemberName(e)}
                                sx={{ ml: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }} /> 
                            <IconButton
                                aria-label="close"
                                onClick={HandleUnPaidGroupAlertClose}
                                sx={{ position: 'absolute', right: 7, top: 4, color: (theme) => theme.palette.grey[500], }} >
                                <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                            </IconButton>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{ overflow: '', mt: 2 }}>
                            <Table sx={{ minWidth: 700 }} stickyHeader>
                                    <TableHeader
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={UnPaidGroupList.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleSort}
                                        onSelectAllClick={handleSelectAllClick}
                                        headLabel={[
                                            { id: 'Group No', label: 'Group No' },
                                            { id: 'Member Name', label: 'Member Name' },
                                            { id: 'Member Id', label: 'Member Id' },
                                            { id: 'Auction Date', label: 'Auction Date' },
                                            { id: 'Ticket No', label: 'Ticket No' },
                                            { id: 'Install No', label: 'Install No' },
                                        ]} />
                                    {UnPaidGroupLoading
                                        ? <Stack mt={10} sx={{ alignItems: 'center' }}>
                                            <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                        </Stack>
                                        : <TableBody>
                                            {UnPaidGroupList
                                                .map((row) => (
                                                    <ChitPaymentMemberTableRow
                                                        key={row.id}
                                                        selected={selected.indexOf(row.name) !== -1}
                                                        handleClick={(event) => handleClick(event, row)}
                                                        item={row} />))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(page, 5, UnPaidGroupList.length)} />
                                            {UnPaidGroupList.length === 0 && <TableNoData query={filterName} />}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={LedgerListAlert}
                fullWidth
                maxWidth="md"
                sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card sx={{ maxWidth: '800px' }}>
                    <Stack sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 5, mt: 2 }}>
                            Account Ledger
                        </Typography>
                        <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center">
                            <TextField
                                placeholder="Ledger Name..."
                                value={LedgerFilterName}
                                onChange={(e) => HandleFilterLedgerName(e)}
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
                            <IconButton
                                aria-label="close"
                                onClick={HandleLedgerListAlertClose}
                                sx={{ position: 'absolute', right: 15, top: 5, color: (theme) => theme.palette.grey[500] }}
                            >
                                <img src="../../../public/assets/icons/cancel.png" alt="Loading" style={{ width: 17, height: 17 }} />
                            </IconButton>
                        </Stack>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
                            <Scrollbar>
                                {LedgerListLoading ? (
                                    <Stack mt={10} sx={{ alignItems: 'center' }}>
                                        <img src="../../../public/assets/icons/list_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
                                    </Stack>
                                ) : (
                                    <Stack>
                                            {LedgerList
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => (
                                            <Stack
                                                key={index}
                                                direction="column"
                                                sx={{ mt: 0.5 }}
                                                onClick={(event) => HandleLedgerClick(event, row)}
                                            >
                                                <Typography sx={{ ml: 4, mr: 5, mb: 0.5, fontSize: 11 }}>
                                                    {row.ledgername}
                                                </Typography>
                                                <Divider sx={{ flexGrow: 1 }} />
                                            </Stack>
                                        ))}
                                        <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, LedgerList.length)} />
                                        {LedgerList.length === 0 && <TableNoData query={LedgerFilterName} />}
                                    </Stack>
                                )}
                            </Scrollbar>
                        </Box>
                        <TablePagination
                            page={page}
                            component="div"
                            count={LedgerTotalCount}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        />
                    </Stack>
                </Card>
            </Dialog>
        </Container>
    );
}