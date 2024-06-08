import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Alert, Button, Dialog, ListItem, Snackbar, IconButton, Typography, Autocomplete, ListItemText, InputAdornment } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_RECEIPT_SAVE, REACT_APP_HOST_URL, CHIT_RECEIPT_DETAIL, CHIT_GET_RECEIPT_NUMBER, CHIT_RECEIPT_PAID_UNPAID_LIST, CHIT_RECEPT_PENDING_GROUP_LIST, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitreceipt-add.css';
import TableHeader from '../member/table-head';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import ChitReceiptMemberTableRow from './chitreceipt-member-list';


export default function AddChitReceiptPage() {

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
    const [AuctionMode, setAuctionMode] = useState({
        data: "",
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: "",
        error: ""
    });
    const [AccountNo, setAccountNo] = useState({
        data: "",
        error: ""
    });
    const [InstFrom, setInstFrom] = useState({
        data: "",
        error: ""
    });
    const [InstTo, setInstTo] = useState({
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
    const [GroupListLoading, setGroupListLoading] = useState(true);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [PendingGroupList, setPendingGroupList] = useState([]);
    const [GroupNoSearch, setGroupNoSearch] = useState({
        data: "",
        error: ""
    });
    const [MemberListAlert, setMemberListAlert] = useState(false);
    const [MemberListLoading, setMemberListLoading] = useState(true);
    const [MemberList, setMemberList] = useState([]);
    const [PaidMemberList, setPaidMemberList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [SelectMemberList, setSelectMemberList] = useState([]);
    const [filterTicketNo, setfilterTicketNo] = useState('');
    const [MemberName, setMemberName] = useState({
        data: "",
        error: ""
    });
    const [ScreenRefresh, setScreenRefresh] = useState(0);

    useEffect(() => {
        if (screen === "add") {
            GetPendingGroupList("");
            if (page) {
                GetMemberList(GroupNoSearch.data ? GroupNoSearch.data.id : "", filterName, filterTicketNo);
            }
        } else if (screen === "view") {
            GetChitReceiptView();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (ScreenRefresh) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [ScreenRefresh]);

    const GetChitReceiptView = () => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_DETAIL}${data.id}`;
        console.log(url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setGroupNoSearch({
                        data: json.list.groupno != null ? json.list.groupno : "",
                        error: ""
                    });
                    setReceiptNo({
                        data: json.list.receiptno != null ? json.list.receiptno : "",
                        error: ""
                    });
                    setMemberName({
                        data: json.list.membername != null ? json.list.membername : "",
                        error: ""
                    });
                    setAuctionMode({
                        data: json.list.auction_mode != null ? json.list.auction_mode : "",
                        error: ""
                    });
                    setDuration({
                        data: json.list.duration != null ? json.list.duration : "",
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
                    setInstFrom({
                        data: json.list.installfrom != null ? json.list.installfrom : "",
                        error: ""
                    });
                    setInstTo({
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

    const GetPendingGroupList = (text) => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEPT_PENDING_GROUP_LIST}1&search=${text}`;
        console.log(url);
        console.log(Session)
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setPendingGroupList(json.list);
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

    const GetMemberList = (groupid, membername, ticketno) => {
        setMemberListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_PAID_UNPAID_LIST}${groupid}&memberName=${membername}&ticketNo=${ticketno}`;
        console.log(url);
        console.log(Session)
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMemberListLoading(false);
                if (json.success) {
                    // setTotalCount(json.total);
                    setMemberList(json.unPaidMembers);
                    setPaidMemberList(json.paidMembers);
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
                setMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const GetReceiptNumberList = (groupid) => {
        const url = `${REACT_APP_HOST_URL}${CHIT_GET_RECEIPT_NUMBER}${groupid}`;
        console.log(url);
        console.log(Session)
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    setReceiptNo({
                        data: json.receiptNo !== "" && json.receiptNo !== null ? (Math.round(json.receiptNo) + 1) : "1",
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
                setErrorAlert(true);
                setErrorScreen("error");
                console.log(error);
            })
    }

    const ChitReceiptInfoParams = {
        "id": 0,
        "branchid": 0,
        "date": ReceiptDate.datasave,
        "groupid": SelectMemberList.group_id,
        "memberid": SelectMemberList.member_id,
        "tktno": TicketNo.data,
        "tkt_percentage": "100",
        "tkt_suffix": "A",
        "group_member_id": SelectMemberList.group_member_id,
        "installfrom": InstFrom.data,
        "installto": InstTo.data,
        "particulars": "",
        "receiptno": ReceiptNo.data != null ? ReceiptNo.data : "",
        "cancel": "",
        "credit_value": Values.data,
        "latefees_percen": 0,
        "latefees_amount": 0,
        "disc_percen": 0,
        "disc_amount": 0,
        "note": "",
        "status": "",
        "comments": "",
        "from_source": "RUNNING_ACCOUNT",
        "is_active": 1,
        "installmentAmounts": []
    }

    const ChitReceiptAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_SAVE}`;
            Params = ChitReceiptInfoParams;
            console.log(JSON.stringify(Params) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    console.log(JSON.stringify(json));
                    setLoading(false);
                    setScreenRefresh(0);
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

    const ChitReceiptTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
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
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "AuctionMode") {
            setAuctionMode(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Duration") {
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "AccountNo") {
            setAccountNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "InstFrom") {
            setInstFrom(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "InstTo") {
            setInstTo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Values") {
            const AmountError = isValidateAmount(text.trim(), GroupNoSearch.data.amount) ? "" : "Receipt amount should not greater than due amount";
            console.log(isValidateAmount(text.trim(), GroupNoSearch.data.amount))
            const ValidError = !isValidNumber(text) ? "* Invalid Amount" : AmountError;
            setValues(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ValidError
            }));
        } else if (from === "MemberName") {
            setMemberName(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        }
    };

    const validateChitReceiptInfo = () => {
        let IsValidate = true;
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
        if (!GroupNoSearch.data) {
            IsValidate = false;
            setGroupNoSearch(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGroupNoSearch(prevState => ({
                ...prevState,
                error: ""
            }));
        }
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
        if (TicketNo.data == null || TicketNo.data === "" || TicketNo.data > 0) {
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
        if (!AuctionMode.data) {
            IsValidate = false;
            setAuctionMode(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAuctionMode(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (Duration.data == null || Duration.data === "" || Duration.data > 0) {
            IsValidate = false;
            setDuration(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setDuration(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (AccountNo.data == null || AccountNo.data === "" || AccountNo.data > 0) {
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
        if (InstFrom.data == null || InstFrom.data === "" || InstFrom.data > 0) {
            IsValidate = false;
            setInstFrom(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstFrom(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (InstTo.data == null || InstTo.data === "" || InstTo.data > 0) {
            IsValidate = false;
            setInstTo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstTo(prevState => ({
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
        } else if (!isValidNumber(Values.data)) {
            IsValidate = false;
            setValues(prevState => ({
                ...prevState,
                error: "* InValid Amount"
            }));
        } else if (!isValidateAmount(Values.data, GroupNoSearch.data.amount)) {
            IsValidate = false;
            setValues(prevState => ({
                ...prevState,
                error: "Receipt amount should not greater than due amount"
            }));
        } else {
            setValues(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (screen === "add") {
            ChitReceiptAddMethod(IsValidate);
        }
    }

    const isValidNumber = (input) => {
        const num = parseFloat(input);
        // Check if the input is not a number, or if it starts with '0.'
        if (Number.isNaN(num) || /^0\.\d+$/.test(input)) {
            return false;
        }
        // Check if the number is positive
        return num > 0;
    };

    const isValidateAmount = (input, specifiedAmount) => {
        const num = parseFloat(input);
        return !Number.isNaN(num) && num <= specifiedAmount;
    };

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            navigate('/chitreceipt/list');
        }
    }

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateChitReceiptInfo();
    };

    const HandleDateChange = (date) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "";
        console.log('Date to save:', DateForSave);
        setReceiptDate({
            data: date,
            datasave: DateForSave,
            error: ""
        });
    };

    const HandleGroupNoSearch = (event, value) => {
        if (value) {
            setScreenRefresh(pre => pre + 1);
            setGroupNoSearch({
                data: value,
                error: ""
            });
            console.log(value);
            setMemberListAlert(true);
            setAuctionMode({
                data: value.auction_mode !== "" && value.auction_mode != null ? value.auction_mode : "",
                error: ""
            });
            setDuration({
                data: value.duration !== "" && value.duration != null ? value.duration : "",
                error: ""
            });
            setValues({
                data: value.amount !== "" && value.amount != null ? value.amount : "",
                error: ""
            });
            GetReceiptNumberList(value.id);
            GetMemberList(value.id, "", "")
        } else {
            setScreenRefresh(0);
            setGroupNoSearch({
                data: "",
                error: ""
            });
            setAuctionMode({
                data: "",
                error: ""
            });
            setDuration({
                data: "",
                error: ""
            });
            setValues({
                data: "",
                error: ""
            });
            setReceiptNo({
                data: "",
                error: ""
            });
            setTicketNo({
                data: "",
                error: ""
            });
            setAccountNo({
                data: "",
                error: ""
            });
            setInstFrom({
                data: "",
                error: ""
            });
            setInstTo({
                data: "",
                error: ""
            });
            setMemberName({
                data: "",
                error: ""
            });
        }
    }

    const HandleMemberListAlertClose = () => {
        setMemberListAlert(false);
        setAuctionMode({
            data: "",
            error: ""
        });
        setDuration({
            data: "",
            error: ""
        });
        setValues({
            data: "",
            error: ""
        });
        setReceiptNo({
            data: "",
            error: ""
        });
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
            const newSelecteds = MemberList.map((n) => n.name);
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
        setSelectMemberList(item);
        if (item.amount_to_be_paid === "0" || item.amount_to_be_paid === "0.00" || item.amount_to_be_paid === 0) {
            setAlertMessage("This Member Paid all the installments..");
            setAlertFrom("failed");
            HandleAlertShow();
        } else {
            setTicketNo({
                data: item.tktNo !== "" && item.tktNo != null ? item.tktNo : "",
                error: ""
            });
            setAccountNo({
                data: item.accno !== "" && item.accno != null ? item.accno : "",
                error: ""
            });
            setInstFrom({
                data: item.inst_from !== "" && item.inst_from != null ? item.inst_from : "",
                error: ""
            });
            setInstTo({
                data: item.inst_to !== "" && item.inst_to != null ? item.inst_to : "",
                error: ""
            });
            setMemberName({
                data: item.name !== "" && item.name != null ? item.name : "",
                error: ""
            });
            setMemberListAlert(false);
        }
    };

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
        GetMemberList(GroupNoSearch.data.id, event.target.value, filterTicketNo);
    };

    const HandleFilterTicketNo = (event) => {
        setPage(0);
        setfilterTicketNo(event.target.value);
        GetMemberList(GroupNoSearch.data.id, filterName, event.target.value);
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitreceipt/list');
            }
        } else {
            navigate('/chitreceipt/list');
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Chit Receipt",
        view: "View Chit Receipt",
        edit: "Edit Chit Receipt",
    };

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    {screenLabel[screen] || "Add Chit Receipt"}
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box className="con" component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '20ch', },
                    }}
                    noValidate
                    autoComplete="off">
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="../../assets/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Receipt Date
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']} sx={{ width: 530 }}>
                                                    <DatePicker
                                                        className='input-box1'
                                                        label="From Date"
                                                        disabled={screen === "view"}
                                                        value={ReceiptDate.data}
                                                        onChange={HandleDateChange}
                                                        format="DD-MM-YYYY" />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                </div>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Group No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <Autocomplete
                                                className='input-box1'
                                                disablePortal
                                                id="combo-box-demo"
                                                options={PendingGroupList}
                                                disabled={screen === "view"}
                                                getOptionLabel={(option) => option.groupno}
                                                onChange={HandleGroupNoSearch}
                                                sx={{}}
                                                renderOption={(props, option) => (
                                                    <ListItem {...props} key={option.id}>
                                                        <ListItemText
                                                            primary={option.groupno}
                                                            secondary={`${option.auction_mode},  ${Math.round(option.amount)}`} />
                                                    </ListItem>
                                                )}
                                                renderInput={(params) => <TextField {...params} label={screen === "view" ? GroupNoSearch.data : "Search"} />}
                                            />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNoSearch.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Member Name
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Member Name"
                                                value={MemberName.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "MemberName")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{MemberName.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Receipt No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Receipt No"
                                                value={ReceiptNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "ReceiptNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{ReceiptNo.error}</div>
                                    </Stack>
                                </div>

                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Ticket No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input-box1'
                                                // required
                                                id="outlined-required"
                                                disabled
                                                label="Ticket No"
                                                value={TicketNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "TicketNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{TicketNo.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Auction Mode
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Auction Mode"
                                                value={AuctionMode.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "AuctionMode")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AuctionMode.error}</div>
                                    </Stack>
                                </div>

                            </Stack>

                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Duration
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Duration"
                                                value={Duration.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "Duration")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Duration.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }} >
                                            Account No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Account No"
                                                value={AccountNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "AccountNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AccountNo.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Inst. From
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Inst. From"
                                                value={InstFrom.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "InstFrom")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{InstFrom.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}  >
                                            Inst. To
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Inst. To"
                                                value={InstTo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "InstTo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{InstTo.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
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
                                                onChange={(e) => ChitReceiptTextValidate(e, "Values")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Values.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            {screen === "view"
                                ? null
                                : <Stack direction='column' alignItems='flex-end'>
                                    <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="../../assets/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                </Stack>}
                        </Stack>}
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
                open={MemberListAlert}
                fullWidth={600}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>
                    <Stack>
                        <Stack mt={2} ml={2} mr={1} direction="row" alignItems="center" >
                            <TextField
                                placeholder="Member Name..."
                                value={filterName}
                                onChange={(e) => HandleFilterMemberName(e)}
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
                                placeholder="Ticket No..."
                                value={filterTicketNo}
                                onChange={(e) => HandleFilterTicketNo(e)}
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
                                className='btn-close'
                                onClick={HandleMemberListAlertClose}
                                sx={{ position: 'absolute', right: 2, top: 0, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="../../assets/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                            </IconButton>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{ overflow: '', mt: 2 }}>
                                <Table sx={{ minWidth: 530 }} stickyHeader>
                                    <TableHeader sx={{ width: '100%' }}
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={MemberList.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleSort}
                                        onSelectAllClick={handleSelectAllClick}
                                        headLabel={[
                                            { id: 'Group', label: 'Group' },
                                            { id: 'Ticket No', label: 'Ticket No' },
                                            { id: 'Name', label: 'Name' },
                                            { id: 'Phone', label: 'Phone' },
                                            { id: 'F.Code', label: 'F.Code' },
                                            { id: 'Status', label: 'Status' },
                                        ]} />
                                    {MemberListLoading
                                        ? <Stack mt={10} sx={{ alignItems: 'center' ,justifyContent:'center'}}>
                                            <img src="../../assets/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                        </Stack>
                                        : <TableBody>
                                            {MemberList
                                                .map((row) => (
                                                    <ChitReceiptMemberTableRow
                                                        key="unpaidmember"
                                                        selected={selected.indexOf(row.name) !== -1}
                                                        handleClick={(event) => handleClick(event, row)}
                                                        item={row} />))}
                                            {PaidMemberList
                                                .map((row) => (
                                                    <ChitReceiptMemberTableRow
                                                        key="paidmember"
                                                        selected={selected.indexOf(row.name) !== -1}
                                                        handleClick={(event) => handleClick(event, row)}
                                                        item={row} />))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(page, 5, MemberList.length)} />
                                            {(MemberList.length === 0 && PaidMemberList.length === 0) && <TableNoData query={filterName} />}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
        </Container>
    );
}