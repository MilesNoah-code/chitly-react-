import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Alert, Button, Dialog, Portal, Divider, ListItem, Snackbar, TableRow, TableCell, IconButton, Typography, Autocomplete, ListItemText, InputAdornment } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { CHIT_RECEIPT_SAVE, REACT_APP_HOST_URL, CHIT_RECEIPT_DETAIL, CHIT_GET_RECEIPT_NUMBER, CHIT_RECEIPT_PAID_UNPAID_LIST, CHIT_RECEPT_PENDING_GROUP_LIST, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';
import ScreenError from 'src/Error/ScreenError';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitreceipt-add.css';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import ChitReceiptMemberTableRow from './chitreceipt-member-list';

export default function AddChitReceiptPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state || {};
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
    const [selected, setSelected] = useState([]);
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
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_DETAIL}${data?.id ? data.id : ""}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
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
                        data: json.list.memberid != null ? json.list.memberid : "",
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
                setGroupListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetPendingGroupList = (text) => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEPT_PENDING_GROUP_LIST}&search=${text}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setPendingGroupList(json.list);
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
                setGroupListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetMemberList = (groupid, membername, ticketno) => {
        setMemberListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_PAID_UNPAID_LIST}${groupid}&memberName=${membername}&ticketNo=${ticketno}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setMemberListLoading(false);
                if (json.success) {
                    // setTotalCount(json.total);
                    setMemberList(json.unPaidMembers);
                    setPaidMemberList(json.paidMembers);
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
                setMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetReceiptNumberList = (groupid) => {
        const url = `${REACT_APP_HOST_URL}${CHIT_GET_RECEIPT_NUMBER}${groupid}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    setReceiptNo({
                        data: json.receiptNo !== "" && json.receiptNo !== null ? (Math.round(json.receiptNo) + 1) : "1",
                        error: ""
                    });
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
            console.log(JSON.parse(Session));
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
                    setLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("error");
                    // console.log(error);
                })
        }
    }

    const ChitReceiptTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
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
            // console.log(isValidateAmount(text.trim(), GroupNoSearch.data.amount))
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
        // console.log(TicketNo.data)
        if (TicketNo.data === null || TicketNo.data === "" || TicketNo.data === "0") {
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
        if (Duration.data === null || Duration.data === "" || Duration.data.length > 0) {
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
        if (AccountNo.data === null || AccountNo.data === "" || AccountNo.data.length > 0) {
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
        if (InstFrom.data === null || InstFrom.data === "" || InstFrom.data.length > 0) {
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
        if (InstTo.data === null || InstTo.data === "" || InstTo.data.length > 0) {
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
        validateChitReceiptInfo();
    };

    const HandleDateChange = (date) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "";
        // console.log('Date to save:', DateForSave);
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
            // console.log(value);
            setMemberListAlert(true);
            setAuctionMode({
                data: value.auction_mode !== "" && value.auction_mode != null ? value.auction_mode : "",
                error: ""
            });
            setDuration({
                data: value.duration !== "" && value.duration != null ? value.duration : "",
                error: ""
            });
            /* setValues({
                data: value.amount !== "" && value.amount != null ? value.amount : "",
                error: ""
            }); */
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
                data: item.member_id !== "" && item.member_id != null ? item.member_id : "",
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
            const AmmountData = item.installment_amounts.reduce((acc, curr) => acc + curr.amount, 0);
            setValues({
                data: AmmountData !== "" && AmmountData != null ? AmmountData : "",
                error: ""
            })
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

    const HandlePreviousScreen = () => {
        navigate('/chitreceipt/list');
    }

    if (!location.state) {
        return <ScreenError HandlePreviousScreen={HandlePreviousScreen} />
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Chit Receipt",
        view: "View Chit Receipt",
        edit: "Edit Chit Receipt",
    };

    return (
        <div  className="chitreceipt-add-screen">
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    {screenLabel[screen] || "Add Chit Receipt"}
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box component="form"
                    sx={{ '& .MuiTextField-root': {}, }}
                    noValidate
                    autoComplete="off">
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column' pb="35px">
                            <Stack direction='row' spacing={1} alignItems='center' gap='10px' justifyContent="flex-start" sx={{ m: 3, mb: 2 }} className='receipt-box'>
                                <div className="receipt-grp receipt-grp1 date-mbl">
                                    <Stack direction='column' className='box-d'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Receipt Date
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']} className="date-pick" >
                                                    <DatePicker
                                                        // label="From Date"
                                                        disabled={screen === "view"}
                                                        value={ReceiptDate.data}
                                                        onChange={HandleDateChange}
                                                        format="DD-MM-YYYY"
                                                        sx={{
                                                         
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                </div>
                                <div className='receipt-grp  grp-mbl' >
                                    <Stack direction='column' >
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Group No <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mb: 2 }}>
                                            <Autocomplete
                                                className='input'
                                                disablePortal
                                                inputProps={{ readOnly: true }}
                                                id="combo-box-demo"
                                                options={PendingGroupList}
                                                disabled={screen === "view"}
                                                getOptionLabel={(option) => option.groupno}
                                                onChange={HandleGroupNoSearch}
                                                renderOption={(props, option) => (
                                                    <ListItem {...props} key={option.id}>
                                                        <ListItemText
                                                            primary={option.groupno}
                                                            secondary={`${option.auction_mode},  ${Math.round(option.amount)}`}
                                                        />
                                                    </ListItem>
                                                )}

                                                renderInput={(params) => <TextField {...params} label={screen === "view" ? GroupNoSearch.data : ""}
                                                    error={!!GroupNoSearch.error}
                                                />}
                                                  sx={{
                                                            pointerEvents: 'auto',
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }} 
                                             
                                            />

                                        </Stack>
                                        {/* <div className='error_txt' >{GroupNoSearch.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' gap='15px' justifyContent="flex-start" sx={{ m: 3, mt: 0, mb: 0 }} className='receipt-box  mbl-st'>
                                <div className='receipt-grp receipt-grp1'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Member Name <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Member Name"
                                                value={MemberName.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "MemberName")}
                                                sx={{
                                                        '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                        }
                                                        }}
                                                error={!!MemberName.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{MemberName.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='receipt-grp'>
                                    <Stack direction='column' >
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Receipt No <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Receipt No"
                                                value={ReceiptNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "ReceiptNo")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!ReceiptNo.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{ReceiptNo.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' gap='15px' justifyContent="flex-start" sx={{ m: 3, mt: 1, mb: 0 }} className='receipt-box  mbl-st'>
                                <div className='receipt-grp receipt-grp1'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Auction Mode
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Auction Mode"
                                                value={AuctionMode.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "AuctionMode")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!AuctionMode.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{AuctionMode.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='receipt-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 0, mb: '0px' }}>
                                            Ticket No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Ticket No"
                                                value={TicketNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "TicketNo")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!TicketNo.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{TicketNo.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' gap='15px' justifyContent="flex-start" sx={{ m: 3, mt: 0, mb: 0 }} className='receipt-box mbl-st'>
                                <div className='receipt-grp receipt-grp1'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 2, mb: '0px' }} >
                                            Account No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Account No"
                                                value={AccountNo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "AccountNo")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!AccountNo.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{AccountNo.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='receipt-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 0 }} >
                                            Duration
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Duration"
                                                value={Duration.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "Duration")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!Duration.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{Duration.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' gap='15px' justifyContent="flex-start" sx={{ m: 3, mt: 0, mb: 0 }} className='receipt-box mbl-st'>
                                <div className='receipt-grp receipt-grp1'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 0 }}>
                                            Inst. From
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Inst. From"
                                                value={InstFrom.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "InstFrom")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!InstFrom.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{InstFrom.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='receipt-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 2, mb: '0px' }}  >
                                            Inst. To
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                // disabled
                                                inputProps={{ readOnly: true }}
                                                // label="Inst. To"
                                                value={InstTo.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "InstTo")}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!InstTo.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{InstTo.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' gap='15px' justifyContent="flex-start" sx={{ m: 3, mt: 0, mb: 0 }} className='receipt-box mbl-st'>
                                <div className='receipt-grp receipt-grp1'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 0 }} >
                                            Value <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input'
                                                id="outlined-required"
                                                disabled={screen === "view"}
                                                inputProps={{ readOnly: true }}
                                                // label="Value"
                                                value={Values.data}
                                                onChange={(e) => ChitReceiptTextValidate(e, "Values")}
                                                type='number'
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        padding: '8px',
                                                        fontSize: '14px',
                                                         backgroundColor: 'rgb(244 244 244)'
                                                    }
                                                }}
                                                error={!!Values.error} />
                                        </Stack>
                                        {/* <div className='error_txt'>{Values.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            {screen === "view"
                                ? null
                                : <Stack direction='column' alignItems='flex-start'>
                                    <Button sx={{ ml: 3, mt: 2, mb: 3, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                </Stack>}
                        </Stack>}
                </Box>
            </Card>
            <Portal>
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
            </Portal>
            <Dialog
                open={MemberListAlert}
                fullWidth
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>
                    <Stack>
                        <Stack ml={1} mr={1} pb={1} direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 1 }}>
                                    Member list
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={HandleMemberListAlertClose}
                                sx={{ position: 'absolute', right: 10, top: 11, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14, }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 0.5, mb: 1 }} />
                        <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center" gap="10px" >
                            <TextField

                                placeholder="Member Name..."
                                value={filterName}
                                onChange={(e) => HandleFilterMemberName(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"sx={{mr:-1}} >
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: -1.5, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px'
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }} />
                            <TextField
                                placeholder="Ticket No..."
                                value={filterTicketNo}
                                onChange={(e) => HandleFilterTicketNo(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{mr:-1}}>
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: -1.5, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }}
                                sx={{
                                    ml: 2,
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px'
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }} />
                        </Stack>
                        <Scrollbar style={{ maxHeight: '70vh' }}>
                            <div style={{ marginLeft: '15px', marginRight: '15px', marginBottom: '15px' }}>
                                <TableContainer sx={{ overflow: '', mt: 2 }}>
                                    <Table sx={{ minWidth: 600 }} stickyHeader>
                                        <TableRow hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                            <TableCell className='with-reduce' sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Id</TableCell>
                                            <TableCell className='with-reduce' sx={{ background: '#edf4fe', color: '#1877f2', }}>Tkt. No</TableCell>
                                            <TableCell className='with-reduce' sx={{ background: '#edf4fe', color: '#1877f2', }}>F.Code</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Phone</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Status</TableCell>
                                        </TableRow>
                                        {MemberListLoading
                                            ? <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                </TableCell>
                                            </TableRow>
                                            : <TableBody>
                                                {MemberList
                                                    .map((row) => (
                                                        <ChitReceiptMemberTableRow
                                                            keyvalue="unpaidmember"
                                                            selected={selected.indexOf(row.name) !== -1}
                                                            handleClick={(event) => handleClick(event, row)}
                                                            item={row} />))}
                                                {PaidMemberList
                                                    .map((row) => (
                                                        <ChitReceiptMemberTableRow
                                                            keyvalue="paidmember"
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
                            </div>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}