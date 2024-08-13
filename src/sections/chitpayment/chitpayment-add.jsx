import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Grid, Stack, Alert, Button, Dialog, Portal, Divider, Snackbar, TableRow, TableCell, IconButton, Typography, InputAdornment, } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { LogOutMethod } from 'src/utils/format-number';
import { CHIT_PAYMENT_SAVE, REACT_APP_HOST_URL, CHIT_PAYMENT_DETAIL, REQ_CHIT_PARAMETERS, CHIT_PAYMENT_LEDGER_LIST, CHIT_PAYMENT_RECEIPT_NUMBER, CHIT_PAYMENT_UNPAID_GROUP_LIST, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';
import ScreenError from 'src/Error/ScreenError';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from 'src/sections/member/utils';

import './chitpayment-add.css';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import ChitPaymentMemberTableRow from './chitpayment-member-list';

export default function AddChitPaymentPage() {

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
    const [MemberName, setMemberName] = useState({
        data: "",
        error: ""
    });
    const [InstallmentNo, setInstallmentNo] = useState({
        data: "",
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
        data: screen === "view" ? null : dayjs(),
        datasave: screen === "view" ? "" : dayjs(dayjs()).format('YYYY-MM-DD'),
        error: ""
    });

    const [Loading, setLoading] = useState(false);
    const [GroupListLoading, setGroupListLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [UnPaidGroupList, setUnPaidGroupList] = useState([]);
    const [GroupNoSearch, setGroupNoSearch] = useState({
        data: "",
        error: ""
    });
    const [UnPaidGroupAlert, setUnPaidGroupAlert] = useState(false);
    const [UnPaidGroupLoading, setUnPaidGroupLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [SelectUnPaidGroup, setSelectUnPaidGroup] = useState({});
    const [filterGroupCode, setfilterGroupCode] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [LedgerListAlert, setLedgerListAlert] = useState(false);
    const [LedgerListLoading, setLedgerListLoading] = useState(true);
    const [LedgerList, setLedgerList] = useState([]);
    const [LedgerTotalCount, setLedgerTotalCount] = useState(0);
    const [LedgerFilterName, setLedgerFilterName] = useState('');
    const [SelectLedgerList, setSelectLedgerList] = useState([]);
    // const [ReqChitParameterList, setReqChitParameterList] = useState([]);
    // const [LedgerNameError, setLedgerNameError] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    const [TotalCount, setTotalCount] = useState(0);
    const [dialogPage, setDialogPage] = useState(0);
    const [dialogRowsPerPage, setDialogRowsPerPage] = useState(10);

    useEffect(() => {
        if (screen === "add") {
            GetUnPaidGroupList("", "", dialogPage * dialogRowsPerPage, dialogRowsPerPage);
            GetLedgerList("", page * rowsPerPage, rowsPerPage);
        } else if (screen === "view") {
            GetChitPaymentView();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen, page, rowsPerPage, dialogPage, dialogRowsPerPage]);

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

    const GetChitPaymentView = () => {
        setGroupListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_DETAIL}${data?.id ? data.id : ""}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupListLoading(false);
                if (json.success) {
                    setReceiptDate({
                        data: json.list.date != null ? dayjs(json.list.date) : null,
                        datasave: json.list.date != null ? dayjs(json.list.date).format('YYYY-MM-DD') : "",
                        error: ""
                    });
                    setGroupNoSearch({
                        data: json.list.groupno != null ? json.list.groupno : "",
                        error: ""
                    });
                    setMemberName({
                        data: json.list.membername != null ? json.list.membername : "",
                        error: ""
                    });
                    setTicketNo({
                        data: json.list.tktno != null ? json.list.tktno : "",
                        error: ""
                    });
                    setReceiptNo({
                        data: json.list.receiptno != null ? Math.round(json.list.receiptno) : "",
                        error: ""
                    });
                    setInstallmentNo({
                        data: json.list.installment_no != null ? json.list.installment_no : "",
                        error: ""
                    });
                    setMobileNo({
                        data: "",
                        error: ""
                    });
                    setAccountNo({
                        data: json.list.memberid != null ? json.list.memberid : "",
                        error: ""
                    });
                    setValues({
                        data: json.list.debit_value != null ? json.list.debit_value : "",
                        error: ""
                    });
                    setParticulars({
                        data: json.list.particulars != null ? json.list.particulars : "",
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

    const GetUnPaidGroupList = (groupcode, memberid, start, limit) => {
        setUnPaidGroupLoading(true);
        setTotalCount(0);
        setUnPaidGroupList([]);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_UNPAID_GROUP_LIST}${groupcode}&memberId=${memberid}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setUnPaidGroupLoading(false);
                if (json.success) {
                    console.log(json.list)
                    console.log(json.total)
                    setTotalCount(json.total);
                    setUnPaidGroupList(json.list)
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
                setUnPaidGroupLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetReceiptNumberList = (groupid) => {
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_RECEIPT_NUMBER}${groupid}`;
        console.log(JSON.parse(Session) + url);
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

    const GetReqChitParameterList = (item) => {
        // setReqChitParameterList([]);
        const url = `${REACT_APP_HOST_URL}${REQ_CHIT_PARAMETERS}${item.id}&memberId=${item.memberid}&tktNo=${item.tktno}&tktSuffix=A`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    // setReqChitParameterList(json.list);
                    if (json.list.length > 0) {
                        if (json.list[0].total_installment_amount > 0) {
                            setReceiptNo(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setTicketNo(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setMemberName(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setInstallmentNo(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setAccountNo(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setMobileNo(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setValues(prevState => ({
                                ...prevState,
                                data: "",
                                error: ""
                            }));
                            setAlertMessage("Please Add Receipt for this group");
                            setAlertFrom("alert_failed");
                            HandleAlertShow();
                        }
                    }
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

    const GetLedgerList = (text, start, limit, from) => {
        setLedgerListLoading(true);
        setLedgerTotalCount(0);
        setLedgerList([]);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_LEDGER_LIST}${text}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setLedgerListLoading(false);
                if (json.success) {
                    setLedgerTotalCount(json.total);
                    setLedgerList([...LedgerList, ...json.list]);
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
                setLedgerListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
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
        "groupid": SelectUnPaidGroup.id,
        "memberid": SelectUnPaidGroup.memberid,
        "group_member_id": SelectUnPaidGroup.groupMemberId,
        "tkt_percentage": "100",
        "tkt_suffix": "A",
        "tktno": TicketNo.data,
        "installment_no": InstallmentNo.data,
        "particulars": Particulars.data,
        "receiptno": ReceiptNo.data != null ? ReceiptNo.data : "",
        "cancel": "",
        "debit_value": Values.data,
        "note": "",
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
            url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_SAVE}`;
            Params = ChitPaymentInfoParams;
            console.log(JSON.stringify(Params) + url);
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

    const ChitPaymentTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
        if (from === "GroupNoSearch") {
            setGroupNoSearch(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "ReceiptNo") {
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
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "AccountNo") {
            setAccountNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "MobileNo") {
            setMobileNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
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
        /* const isLedgerListValid = validateLedgerList();
        if (SelectUnPaidGroup.memberid !== 1) {
            if (SelectLedgerList.length === 0) {
                IsValidate = false;
                setLedgerNameError("* Add At least one Ledger Contra Entry Details");
            } else {
                setLedgerNameError("");
            }
            if (!isLedgerListValid) {
                IsValidate = false;
            }
        } */
        if (screen === "add") {
            ChitPaymentAddMethod(IsValidate);
        }
    };

    /* const validateLedgerList = () => {
        let isValid = true;
        setSelectLedgerList(prevState =>
            prevState.map(ledger => {
                const updatedLedger = { ...ledger };
                if (ledger.name.trim() === "") {
                    updatedLedger.nameerror = "* Required";
                    isValid = false;
                }
                if (ledger.value.trim() === "") {
                    updatedLedger.valueerror = "* Required";
                    isValid = false;
                }
                if (ledger.particular.trim() === "") {
                    updatedLedger.particularerror = "* Required";
                    isValid = false;
                }
                return updatedLedger;
            })
        );
        return isValid;
    }; */

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            navigate('/chitpayment/list');
        }
    };

    const HandleSubmitClick = () => {
        validateChitPaymentInfo();
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

    const HandleGroupNoSearch = () => {
        setUnPaidGroupAlert(true);
    }

    const HandleUnPaidGroupAlertClose = () => {
        setUnPaidGroupAlert(false);
    };

    const handleClick = (event, item) => {
        setScreenRefresh(pre => pre + 1);
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
        console.log(item)
        setGroupNoSearch({
            data: item.groupno,
            error: ''
        });
        setTicketNo(prevState => ({
            ...prevState,
            data: item.tktno,
            error: ""
        }));
        setMemberName(prevState => ({
            ...prevState,
            data: item.member_name,
            error: ""
        }));
        setInstallmentNo(prevState => ({
            ...prevState,
            data: item.installno,
            error: ""
        }));
        setAccountNo(prevState => ({
            ...prevState,
            data: item.memberid,
            error: ""
        }));
        setMobileNo(prevState => ({
            ...prevState,
            data: item.mappedPhone,
            error: ""
        }));
        setValues(prevState => ({
            ...prevState,
            data: item.prizedAmount,
            error: ""
        }));
        GetReceiptNumberList(item.id);
        GetReqChitParameterList(item);
        setUnPaidGroupAlert(false);
    };

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
        GetUnPaidGroupList(filterGroupCode, event.target.value, dialogPage * dialogRowsPerPage, dialogRowsPerPage );
    };

    const HandleFilterGroupCode = (event) => {
        setPage(0);
        setfilterGroupCode(event.target.value);
        GetUnPaidGroupList(event.target.value, filterName, dialogPage * dialogRowsPerPage, dialogRowsPerPage);
    };

    const HandleCreateLedger = () => {
        setLedgerListAlert(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setLedgerTotalCount(0);
        setLedgerList([]);
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    const handleChangeDialogPage = (event, newPage) => {
        setDialogPage(newPage);
    };

    const handleChangeDialogRowsPerPage = (event) => {
        setDialogPage(0);
        setUnPaidGroupList([]);
        setDialogRowsPerPage(parseInt(event.target.value, 10));
    };


    const HandleLedgerListAlertClose = () => {
        setLedgerListAlert(false);
        setScreenRefresh(0);
    };

    const HandleFilterLedgerName = (event) => {
        setPage(0);
        setLedgerTotalCount(0);
        setLedgerList([]);
        setLedgerFilterName(event.target.value);
        GetLedgerList(event.target.value, page * rowsPerPage, rowsPerPage);
    };

    const HandleLedgerClick = (event, item) => {
        const isItemAlreadySelected = SelectLedgerList.some(ledger => ledger.name === item.ledgername);
        if (isItemAlreadySelected) {
            setAlertMessage("This Ledger is Already Selected");
            setAlertFrom("failed");
            HandleAlertShow();
        } else {
            setScreenRefresh(pre => pre + 1);
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
        }
    };

    const ChitPaymentLedgerTextValidate = (e, item, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        // console.log(from);
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

    const removeLedgerItem = (index) => {
        setScreenRefresh(pre => pre + 1);
        setSelectLedgerList(prevList => prevList.filter((_, i) => i !== index));
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitpayment/list');
            }
        } else {
            navigate('/chitpayment/list');
        }
    }

    const HandlePreviousScreen = () => {
        navigate('/chitpayment/list');
    }

    if (!location.state) {
        return <ScreenError HandlePreviousScreen={HandlePreviousScreen} />
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    const screenLabel = {
        add: "Add Chit Payment",
        view: "View Chit Payment",
        edit: "Edit Chit Payment",
    };

    return (
        <div className='chitpayment-add-screen'>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    {screenLabel[screen] || "Add Chit Payment"}
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box component="form"
                
                    noValidate
                    autoComplete="off">
                    {GroupListLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Grid container spacing={1} className="pay_grid">
                                <Grid item xs={12} md={6}  className='box-one'>
                                    <Stack direction='row' spacing={2} alignItems='center' className='pay-box date-col mar'>
                                        <div className='box-pay-grp box'>
                                            <Stack direction='column' className='box-d'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Receipt Date
                                                </Typography>
                                                <Stack direction='row'  sx={{ ml: 0, mt: 0 }} className='date-picker-stack' >
                                                    <LocalizationProvider  dateAdapter={AdapterDayjs} className='date-picker' >
                                                        <DemoContainer components={['DatePicker']} className="date-pick">
                                                            <DatePicker
                                                                // label="From Date"
                                                                disabled={screen === "view"}
                                                                value={ReceiptDate.data}
                                                                onChange={HandleDateChange}
                                                                format="DD-MM-YYYY"
                                                                sx={{
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '9px',
                                                                        fontSize: '14px'
                                                                    },
                                                                    '& .MuiInputAdornment-root': {
                                                                        // padding: '8px',
                                                                    },
                                                                }} />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-pay-grp pay-gp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 ,mb:1}}>
                                                    Group No <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        // label="Group No"
                                                        value={GroupNoSearch.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "GroupNoSearch")}
                                                        onClick={HandleGroupNoSearch}
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
                                                        error={!!GroupNoSearch.error}
                                                        />
                                                </Stack>
                                                {/* <div className='error_txt'>{GroupNoSearch.error}</div> */}
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='pay-box'>
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb:1 }}>
                                                    Member Name <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        // disabled
                                                        inputProps={{ readOnly: true }}

                                                        // label="Member Name"
                                                        value={MemberName.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "MemberName")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }} 
                                                        error={!!MemberName.error}/>
                                                </Stack>
                                                {/* <div className='error_txt'>{MemberName.error}</div> */}
                                            </Stack>
                                        </div>
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2,mb:1 }} >
                                                    Ticket No <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        // disabled
                                                        inputProps={{ readOnly: true }}

                                                        // label="Ticket No"
                                                        value={TicketNo.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "TicketNo")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }}
                                                        error={!!TicketNo.error}  />
                                                </Stack>
                                            {/* <div className='error_txt'>{TicketNo.error}</div> */}
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='pay-box'>
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb:1 }}>
                                                    Receipt No <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        // disabled
                                                        inputProps={{ readOnly: true }}
                                                        // label="Receipt No"
                                                        value={ReceiptNo.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "ReceiptNo")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }} 
                                                         error={!!ReceiptNo.error}/>
                                                </Stack>
                                                {/* <div className='error_txt'>{ReceiptNo.error}</div> */}
                                            </Stack>
                                        </div>
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 ,mb:1}}>
                                                    Installment No <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        // disabled
                                                        inputProps={{ readOnly: true }}
                                                        // label="Installment No"
                                                        value={InstallmentNo.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "InstallmentNo")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }}
                                                        error={!!InstallmentNo.error} />
                                                </Stack>
                                                {/* <div className='error_txt'>{InstallmentNo.error}</div> */}
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='pay-box'>
                                        {screen === "view"
                                            ? null
                                            : <div className='box-pay-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb:1 }}>
                                                        Mobile No <span style={{ color: 'red' }}> *</span>
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 0, }}>
                                                        <TextField
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            // disabled
                                                            inputProps={{ readOnly: true }}
                                                            // label="Mobile No"
                                                            value={MobileNo.data}
                                                            onChange={(e) => ChitPaymentTextValidate(e, "MobileNo")}
                                                            type='number'
                                                            sx={{
                                                                '& .MuiInputBase-input': {
                                                                    padding: '8px',
                                                                    fontSize: '14px',
                                                                      backgroundColor: 'rgb(244 244 244)'
                                                                },
                                                                '& .MuiInputAdornment-root': {
                                                                    padding: '8px',
                                                                },
                                                            }}
                                                            error={!!MobileNo.error} />
                                                    </Stack>
                                                    {/* <div className='error_txt'>{MobileNo.error}</div> */}
                                                </Stack>
                                            </div>}
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2,mb:1, mr: screen === "view" ? 2 : 0 }} >
                                                    Account No <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        // disabled
                                                        // label="Account No"
                                                        value={AccountNo.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "AccountNo")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }}
                                                        error={!!AccountNo.error} />
                                                </Stack>
                                                {/* <div className='error_txt'>{AccountNo.error}</div> */}
                                            </Stack>
                                        </div>
                                        {screen === "view"
                                            ? <div className='box-pay-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant='subtitle1' sx={{ mt: 2, ml: 2,mb:1 }}>
                                                        Value <span style={{ color: 'red' }}> *</span>
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 0, }}>
                                                        <TextField
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            // disabled
                                                            inputProps={{ readOnly: true }}
                                                            // label="Value"
                                                            value={Values.data}
                                                            onChange={(e) => ChitPaymentTextValidate(e, "Values")}
                                                            sx={{
                                                                '& .MuiInputBase-input': {
                                                                    padding: '8px',
                                                                    fontSize: '14px',
                                                                      backgroundColor: 'rgb(244 244 244)'
                                                                },
                                                                '& .MuiInputAdornment-root': {
                                                                    padding: '8px',
                                                                },
                                                            }}
                                                            error={!!Values.error} />
                                                    </Stack>
                                                    {/* <div className='error_txt'>{Values.error}</div> */}
                                                </Stack>
                                            </div>
                                            : null}
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='pay-box'>
                                        {screen === "view"
                                            ? null
                                            : <div className='box-pay-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant='subtitle1' sx={{ ml: 2, mr: 2, mt: 2, mb:1 }}>
                                                        Value <span style={{ color: 'red' }}> *</span>
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 0, }}>
                                                        <TextField
                                                            className='input-box1'
                                                            id="outlined-required"
                                                            // disabled
                                                            inputProps={{ readOnly: true }}
                                                            // label="Value"
                                                            value={Values.data}
                                                            onChange={(e) => ChitPaymentTextValidate(e, "Values")}
                                                            sx={{
                                                                '& .MuiInputBase-input': {
                                                                    padding: '8px',
                                                                    fontSize: '14px',
                                                                      backgroundColor: 'rgb(244 244 244)'
                                                                },
                                                                '& .MuiInputAdornment-root': {
                                                                    padding: '8px',
                                                                },
                                                            }}
                                                            error={!!Values.error} />
                                                    </Stack>
                                                    {/* <div className='error_txt'>{Values.error}</div> */}
                                                </Stack>
                                            </div>}
                                        <div className='box-pay-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2,mb:1, mr: screen === "view" ? 2 : 0 }}>
                                                    Particulars <span style={{ color: 'red' }}> *</span>
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled={screen === "view"}
                                                        // label="Particulars"
                                                        value={Particulars.data}
                                                        onChange={(e) => ChitPaymentTextValidate(e, "Particulars")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                padding: '8px',
                                                                fontSize: '14px',
                                                                  backgroundColor: 'rgb(244 244 244)'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                                padding: '8px',
                                                            },
                                                        }} 
                                                        error={!!Particulars.error}/>
                                                </Stack>
                                                {/* <div className='error_txt'>{Particulars.error}</div> */}
                                            </Stack>
                                        </div>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'none' }} className={screen === "view" ? 'view-one' : 'box-one'}>

                                    {screen === "view"
                                        ? null
                                        : <Stack direction='column' sx={{ mt: 3 }}>
                                            {SelectUnPaidGroup.memberid === 1
                                                ? null
                                                : <Stack direction='row' spacing={2} alignItems='center' sx={{ ml: 1, mt: 0 }}>
                                                    <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 1, mb: '0px' }}>
                                                        Ledger Contra Entry Details
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 1, }} onClick={HandleCreateLedger}>
                                                        <img src="/assets/images/img/rounded_plus.png" alt="Loading" style={{ width: 18, height: 18, }} />
                                                    </Stack>
                                                </Stack>}
                                            {/* SelectUnPaidGroup.memberid === 1
                                                ? null
                                                : <div className='error_txt ledger_error'>{LedgerNameError}</div> */}
                                            <Stack>
                                                {SelectLedgerList
                                                    .map((row, index) => (
                                                        <Stack direction='row' spacing={1} alignItems='center' className='pay-box  bor' justifyContent='flex-start' gap="5px" >
                                                            <div className='pay-grp pad-r name-width' >
                                                                <Stack direction='column'>
                                                                    <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 1, mb: '4px' }}>
                                                                        Name <span style={{ color: 'red' }}> *</span>
                                                                    </Typography>
                                                                    <Stack direction='row' sx={{ mt: 0, ml: 0 }}>
                                                                        <TextField
                                                                            className='ledg-in'
                                                                            id="outlined-required"
                                                                            disabled
                                                                            value={row.name}
                                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerName")}
                                                                            sx={{
                                                                                '& .MuiInputBase-input': {
                                                                                    padding: '8px',
                                                                                    fontSize: '14px'
                                                                                },
                                                                                '& .MuiInputAdornment-root': {
                                                                                    padding: '8px',
                                                                                },
                                                                            }} />
                                                                    </Stack>
                                                                    <div className='ledger_error'>{row.nameerror}</div>
                                                                </Stack>
                                                            </div>
                                                            <div className='pay-grp value-width'>
                                                                <Stack direction='column'>
                                                                    <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 1, mb: '4px' }}>
                                                                        Value <span style={{ color: 'red' }}> *</span>
                                                                    </Typography>
                                                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                                        <TextField
                                                                            className='ledg-in'
                                                                            id="outlined-required"
                                                                            disabled={screen === "view"}
                                                                            // label="Value"
                                                                            value={row.value}
                                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerValues")}
                                                                            sx={{
                                                                                '& .MuiInputBase-input': {
                                                                                    padding: '8px',
                                                                                    fontSize: '14px'
                                                                                },
                                                                                '& .MuiInputAdornment-root': {
                                                                                    padding: '8px',
                                                                                },
                                                                            }} />
                                                                    </Stack>
                                                                    <div className='ledger_error1'>{row.valueerror} </div>
                                                                </Stack>
                                                            </div>
                                                            <div className='pay-grp  box-popfix'>
                                                                <Stack direction='column'>
                                                                    <Typography variant='subtitle1' sx={{ ml: 0, mr: 2, mt: 1, mb: '4px' }} >
                                                                        Particular <span style={{ color: 'red' }}> *</span>
                                                                    </Typography>
                                                                    <Stack direction='row' sx={{ ml: 0, }}>
                                                                        <TextField
                                                                            className='ledg-in'
                                                                            id="outlined-required"
                                                                            disabled={screen === "view"}
                                                                            // label="Particular"
                                                                            value={row.particular}
                                                                            onChange={(e) => ChitPaymentLedgerTextValidate(e, row, "LedgerParticular")}
                                                                            sx={{
                                                                                '& .MuiInputBase-input': {
                                                                                    padding: '8px',
                                                                                    fontSize: '14px'
                                                                                },
                                                                                '& .MuiInputAdornment-root': {
                                                                                    padding: '8px',
                                                                                },
                                                                            }} />
                                                                    </Stack>
                                                                    <div className='ledger_error1'>{row.particularerror}</div>
                                                                </Stack>
                                                                <Stack direction='column' className='cancel-btn' sx={{ cursor: 'pointer' }} onClick={() => removeLedgerItem(index)}>
                                                                    <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14, }} />
                                                                </Stack>
                                                            </div>
                                                        </Stack>
                                                    ))}
                                            </Stack>
                                        </Stack>}
                                </Grid>
                            </Grid>
                            {screen === "view"
                                ? null
                                : <Stack direction='column' alignItems='flex-start'>
                                    <Button sx={{ ml: 3, mb: 3, }} variant="contained" className='custom-button submit' onClick={Loading ? null : HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                </Stack>}
                        </Stack>}
                </Box>
            </Card>
            <Portal>
                <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "alert_failed" ? 2000 : 1000} onClose={HandleAlertClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
                    <Alert
                        onClose={HandleAlertClose}
                        severity={AlertFrom === "failed" || AlertFrom === "alert_failed" ? "error" : "success"}
                        variant="filled"
                        sx={{ width: '100%' }} >
                        {AlertMessage}
                    </Alert>
                </Snackbar>
            </Portal>
            <Dialog
                open={UnPaidGroupAlert}
                fullWidth
                maxWidth={false}
                // sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            // maxWidth: "700px",  
                        },
                    },
                }}>
                <Card className='chitpayment-card'>
                    <Stack className='chitpayment-card-stack' sx={{ mr: 2 }}>
                        <Stack ml={1} mr={1} direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 1 }}>
                                    Group Member list
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={HandleUnPaidGroupAlertClose}
                                sx={{ position: 'absolute', right: 12, top: 10, color: (theme) => theme.palette.grey[500], }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14, }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 2, mb: 1 }} />
                        <Stack mt={1} ml={2} mr={1} className='popup-input-stackfield chit-payment-add' direction="row" alignItems="center"  >
                            <TextField
                         className="search-text-field"
                                placeholder="Group Code..."
                                value={filterGroupCode}
                                onChange={(e) => HandleFilterGroupCode(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start"  className="search-icon-adornment" sx={{mr:-1}}>
                                            <Iconify
                                                icon="eva:search-fill"
                                                  className="search-icon"
                                                sx={{ ml: -1.5, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px',
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }}
                            />
                            <TextField
                              className="search-text-field input2-stack"
                                placeholder="Member Id..."
                                value={filterName}
                                onChange={(e) => HandleFilterMemberName(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" className="search-icon-adornment" sx={{mr:-1}}>
                                            <Iconify
                                                icon="eva:search-fill"
                                                  className="search-icon"
                                                sx={{ ml: -1.5, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }}
                                sx={{
                                    ml: 2,
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px',
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }}
                            />
                        </Stack>
                        <Scrollbar className='chitpayment-table-scrollbar-div'  style={{ maxHeight: '70vh' }}>
                            <div className='chitpayment-popup-tableabove-div' style={{ paddingLeft: 2, paddingRight: 2 }}>
                                <TableContainer className='chitpayment-tablecontainer-div' sx={{ mt: 2, mb: 2, ml: 2, mr: 2 }}>
                                    <Table stickyHeader className='chitpayment-add-table'>
                                        <TableRow className='chitpayment-add-headrow' hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Group No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Id</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Auction Date</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Ticket. No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Install. No</TableCell>
                                        </TableRow>
                                        {UnPaidGroupLoading
                                            ? <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                </TableCell>
                                            </TableRow>
                                            : <TableBody>
                                                {UnPaidGroupList.slice(dialogPage * dialogRowsPerPage, dialogPage * dialogRowsPerPage + dialogRowsPerPage)
                                                    .map((row) => (
                                                        <ChitPaymentMemberTableRow
                                                            key={row.id}
                                                            selected={selected.indexOf(row.id) !== -1}
                                                            handleClick={(event) => handleClick(event, row)}
                                                            item={row} />))}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(page, 5, UnPaidGroupList.length)} />
                                                {UnPaidGroupList.length === 0 && <TableNoData query={filterName} />}
                                            </TableBody>}
                                    </Table>
                                </TableContainer>
                                {UnPaidGroupList.length > 0 &&
                                    <TablePagination
                                        sx={{ mb: 3 }}
                                        page={dialogPage}
                                        component="div"
                                        count={TotalCount}
                                        rowsPerPage={dialogRowsPerPage}
                                        onPageChange={handleChangeDialogPage}
                                        rowsPerPageOptions={[5, 10, 15]}
                                        onRowsPerPageChange={handleChangeDialogRowsPerPage}
                                    />
                                }
                            </div>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={LedgerListAlert}
                fullWidth
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card >
                    <Stack>
                        <Stack ml={1} mr={1} pb={1} direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                    Account Ledger
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                onClick={HandleLedgerListAlertClose}
                                sx={{ position: 'absolute', right: 15, top: 9, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14 }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 1, mb: 1 }} />
                        <Stack mt={1} ml={2} mr={1} pb={1} direction="row" alignItems="center">
                            <TextField
                                placeholder="Ledger Name..."
                                value={LedgerFilterName}
                                onChange={(e) => HandleFilterLedgerName(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, mt: 1, mb: 1, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px',
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }}
                            />
                        </Stack>
                        <Box sx={{ flexGrow: 2, mt: 0 }}>
                            <Scrollbar style={{ maxHeight: '70vh' }}>
                                {LedgerListLoading ? (
                                    <Stack mt={10} sx={{ alignItems: 'center' }}>
                                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
                                    </Stack>
                                ) : (
                                    <Stack >
                                        {LedgerList
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => (
                                                <Stack
                                                    key={index}
                                                    direction="column"
                                                    sx={{ mt: 0.5, cursor: 'pointer' }}
                                                    onClick={(event) => HandleLedgerClick(event, row)}
                                                >
                                                    <Typography sx={{ ml: 4, mr: 5, mb: 1.5, p: 1, fontSize: 14 }}>
                                                        {row.ledgername}
                                                    </Typography>
                                                    <Divider sx={{ flexGrow: 1 }} />
                                                </Stack>
                                            ))}
                                        <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, LedgerList.length)} />
                                        {LedgerList.length === 0 && <TableNoData query={LedgerFilterName} />}
                                    </Stack>
                                )}
                                {LedgerList.length > 0 && <TablePagination
                                    page={page}
                                    component="div"
                                    count={LedgerTotalCount}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={handleChangePage}
                                    rowsPerPageOptions={[15, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{ borderTop: '1px solid #e0e0e0' }} />}
                            </Scrollbar>
                        </Box>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}