import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Grid, Alert, Stack, Button, Dialog, styled,Portal, Divider, Snackbar, IconButton, Typography, DialogTitle, DialogActions, InputAdornment, TablePagination,  } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, DeleteHeader, } from 'src/hooks/AxiosApiFetch';

import { MEMBER_VIEW, GROUP_MEMBER_LIST, CHIT_ESTIMATE_SAVE, REACT_APP_HOST_URL, CHIT_ESTIMATE_LIST, STANDING_INSTRUCTION, CHIT_ESTIMATE_UPDATE, CHIT_ESTIMATE_DELETE, CHIT_ESTIMATE_MEMBER_LIST, CHIT_ESTIMATE_MEMBER_SAVE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';
import ScreenError from 'src/Error/ScreenError';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './chitestimate-add.css';
import { emptyRows } from '../member/utils';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';

export default function AddChitEstimatePage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state || {};
    const Session = localStorage.getItem('apiToken');
    const [GroupNo, setGroupNo] = useState({
        data: data && data.groupno ? data.groupno : "",
        error: ""
    });
    const [ForemanPrDue, setForemanPrDue] = useState({
        data: data && data.fmprdue ? data.fmprdue : "",
        error: ""
    });
    const [Amount, setAmount] = useState({
        data: data && data.amount ? data.amount : "",
        error: ""
    });
    const [Dividend, setDividend] = useState({
        data: data && data.divident_distribute ? data.divident_distribute : "",
        error: ""
    });
    const [Duration, setDuration] = useState({
        data: data && data.duration ? data.duration : "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));
    const [ChitEstimateLoading, setChitEstimateLoading] = useState(true);
    const [ChitEstimateList, setChitEstimateList] = useState([]);
    const [ChitEstimateMemberLoading, setChitEstimateMemberLoading] = useState(false);
    const [ChitEstimateMemberList, setChitEstimateMemberList] = useState([]);
    const [ChitEstimateListAdd, setChitEstimateListAdd] = useState(0);
    const [MemberDeleteClick, setMemberDeleteClick] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [GroupMemberListAlert, setGroupMemberListAlert] = useState(false);
    const [GroupMemberListLoading, setGroupMemberListLoading] = useState(true);
    const [GroupMemberList, setGroupMemberList] = useState([]);
    const [TotalCount, setTotalCount] = useState(0);
    const [FilterName, setFilterName] = useState('');
    const [filterTicketNo, setfilterTicketNo] = useState('');
    const [SelectGroupMemberList, setSelectGroupMemberList] = useState({
        add: 0,
        remove: 0,
        remove_data: '',
    });
    const [AuctionDateError, setAuctionDateError] = useState('');
    const [MemberUpdateLoading, setMemberUpdateLoading] = useState(false);

    useEffect(() => {
        console.log(data)
        GetChitEstimateList();
        GetChitEstimateMemberList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    useEffect(() => {
        GetGroupMemberList(FilterName, filterTicketNo, page * rowsPerPage, rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, FilterName, filterTicketNo ]);

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

    const GetChitEstimateList = () => {
        setChitEstimateLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_LIST}${data?.id ? data.id : ""}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setChitEstimateLoading(false);
                if (json.success) {
                    const existingList = json.list;
                    const existingInstno = new Set(existingList.map(item => item.Instno));

                    // Determine the missing Instno values
                    const missingInstnos = [];
                    let i = 1;
                    while (i <= data.duration) {
                        if (!existingInstno.has(i)) {
                            missingInstnos.push(i);
                        }
                        i += 1;
                    }

                    const additionalData = missingInstnos.map((instno, index) => ({
                        id: `id_${instno}`,
                        Instno: instno,
                        area_id: 0,
                        auctiondate: null,
                        auctiondate_save: "0",
                        dueamount: "0",
                        less_amount: "",
                        fm_commission: "",
                        gst_value: "0",
                        doc_charge_value: "0",
                        payment: "0",
                        auctiondate_error: "",
                        dueamount_error: "",
                        less_amount_error: "",
                        fm_commission_error: "",
                    }));
                    const completeList = [...existingList, ...additionalData];
                    completeList.sort((a, b) => a.Instno - b.Instno);
                    setChitEstimateList(completeList);
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
                setChitEstimateLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetChitEstimateMemberList = (from) => {
        if(from === "company_member"){
            // console.log(from)
        }else{
            setChitEstimateMemberLoading(true);
        }
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_MEMBER_LIST}${data?.id ? data.id : ""}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    const existingList = json.list;

                    // Extract the existing install_no values
                    const existingInstallNos = new Set(existingList.map(item => item.install_no));

                    // Determine the missing install_no values
                    const missingInstallNos = [];
                    let i = 1;
                    while (i <= data.duration) {
                        if (!existingInstallNos.has(i)) {
                            missingInstallNos.push(i);
                        }
                        i += 1;
                    }

                    // Generate the additional data for missing install_no values
                    const additionalData = missingInstallNos.map((install_nos, index) => ({
                        id: `id_${install_nos}`,
                        group_id: data.id,
                        install_no: install_nos,
                        ticket_no: install_nos,
                        member_id: "",
                        tkt_suffix: "A",
                        tkt_percentage: "100",
                        is_active: true,
                        comments: "",
                        memberProfile: "",
                        memberName: "",
                        accno: "",
                        action: "add"
                    }));
                    const completeList = [...existingList, ...additionalData];
                    completeList.sort((a, b) => a.install_no - b.install_no);
                    setChitEstimateMemberList(completeList);
                    setSelectGroupMemberList({
                        add: 0,
                        remove: 0,
                        remove_data: '',
                    });
                    if (json.list.length === 0) {
                        GetStandingInstructionList(completeList);
                    } else {
                        setChitEstimateMemberLoading(false);
                    }
                } else if (json.success === false) {
                    setChitEstimateMemberLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setChitEstimateMemberLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setChitEstimateMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetStandingInstructionList = (datas) => {
        const url = `${REACT_APP_HOST_URL}${STANDING_INSTRUCTION}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    GetMemberView(json.list.id, datas)
                } else if (json.success === false) {
                    setChitEstimateMemberLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setChitEstimateMemberLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setChitEstimateMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetMemberView = (id, datas) => {
        const url = `${REACT_APP_HOST_URL}${MEMBER_VIEW}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setChitEstimateMemberLoading(false);
                if (json.success) {
                    if (datas.length > 0) {
                        const updatedFirstItem = {
                            ...datas[0],
                            member_id: json.list.id,
                            comments: "",
                            memberProfile: json.list.mapped_photo,
                            memberName: json.list.name,
                            accno: json.list.id,
                            action: "delete"
                        };
                        const updatedList = [updatedFirstItem, ...datas.slice(1)];
                        // console.log('Updated list after updating first item:', updatedList);
                        setSelectGroupMemberList({
                            add: 0,
                            remove: 0,
                            remove_data: '',
                        });
                        ChitEstimateMemberAddMethod(updatedFirstItem, "company_member");
                        setChitEstimateMemberList(updatedList);
                    }
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
                setChitEstimateMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetGroupMemberList = (membername, ticketno, start, limit) => {
        setGroupMemberListLoading(true);
        setTotalCount(0);
        setGroupMemberList([]);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}&groupId=${data?.id ? data.id : ""}&memberName=${membername}&tktNo=${ticketno}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupMemberListLoading(false);
                if (json.success) {
                    setTotalCount(json.total);
                    setGroupMemberList([...GroupMemberList, ...json.list]);
                } else if (json.success === false) {
                    setGroupMemberListAlert(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setGroupMemberListAlert(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setGroupMemberListAlert(false);
                setGroupMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitEstimateAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            const ChitEstimateListParams = ChitEstimateList.map(item =>
                !String(item.id).includes('id_') ? {
                    "groupid": data.id,
                    "Instno": item.Instno,
                    "auctiondate": item.auctiondate_save,
                    "dueamount": item.dueamount,
                    "payment": item.payment,
                    "startpercentage": 0,
                    "calcpercentage": 0,
                    "less_amount": item.less_amount,
                    "area_id": item.area_id,
                    "gst_value": item.gst_value,
                    "doc_charge_value": item.doc_charge_value,
                    "is_blocked": 0,
                    "online_flag": 0,
                    "fm_commission": item.fm_commission,
                } : null
            ).filter(item => item !== null);
            const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_SAVE}`;
            console.log(JSON.stringify(ChitEstimateListParams) + url);
            fetch(url, PostHeader(JSON.parse(Session), ChitEstimateListParams))
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
                    // console.log(error);
                })
        }
    }

    const ChitEstimateMemberAddMethod = (selectedmember, from) => {
        if (from === "company_member"){
            // console.log(from);
        } else{
            setMemberUpdateLoading(true);
        }
        
        const ChitEstimateMemberListParams = {
            "id": 0,
            "group_id": selectedmember.group_id,
            "install_no": selectedmember.install_no,
            "ticket_no": selectedmember.ticket_no,
            "member_id": selectedmember.member_id,
            "tkt_suffix": "A",
            "tkt_percentage": "100",
            "is_active": selectedmember.is_active,
            "comments": selectedmember.comments
        };
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_MEMBER_SAVE}`;
        console.log(JSON.stringify(ChitEstimateMemberListParams) + url);
        fetch(url, PostHeader(JSON.parse(Session), ChitEstimateMemberListParams))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMemberUpdateLoading(false);
                setScreenRefresh(0);
                if (json.success) {
                    if (from === "company_member") {
                        GetChitEstimateMemberList("company_member");
                    } else {
                        setAlertMessage(json.message);
                        setAlertFrom("success");
                        HandleAlertShow();
                    }
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
                setMemberUpdateLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitEstimateMemberUpdateMethod = (id, selectedmember) => {
        setMemberUpdateLoading(true);
        const ChitEstimateMemberListParams = {
            "id": 0,
            "group_id": selectedmember.group_id,
            "install_no": selectedmember.install_no,
            "ticket_no": selectedmember.ticket_no,
            "member_id": selectedmember.member_id,
            "tkt_suffix": "A",
            "tkt_percentage": "100",
            "is_active": selectedmember.is_active,
            "comments": selectedmember.comments
        };
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_UPDATE}${id}`;
        console.log(JSON.stringify(ChitEstimateMemberListParams) + url);
        fetch(url, PutHeader(JSON.parse(Session), ChitEstimateMemberListParams))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setMemberUpdateLoading(false);
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
                setMemberUpdateLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitEstimateMemberDeleteMethod = (id) => {
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_DELETE}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, DeleteHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
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
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitEstimateTextValidate = (e, from) => {
        const text = e.target.value;
        setChitEstimateListAdd(pre => pre + 1);
        // console.log(from);
        if (from === "GroupNo") {
            setGroupNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "ForemanPrDue") {
            setScreenRefresh(pre => pre + 1);
            setForemanPrDue(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Amount") {
            setAmount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dividend") {
            setScreenRefresh(pre => pre + 1);
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "Duration") {
            setDuration(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateChitEstimateInfo = () => {
        let IsValidate = true;
        if (!GroupNo.data) {
            IsValidate = false;
            setGroupNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setGroupNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        /* if (!ForemanPrDue.data) {
            IsValidate = false;
            setForemanPrDue(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setForemanPrDue(prevState => ({
                ...prevState,
                error: ""
            }));
        } */
        if (!Amount.data) {
            IsValidate = false;
            setAmount(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAmount(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        /* if (!Dividend.data) {
            IsValidate = false;
            setDividend(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setDividend(prevState => ({
                ...prevState,
                error: ""
            }));
        } */
        if (!Duration.data) {
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
        const isChitEstimateListValid = validateChitEstimateList();
        if (!isChitEstimateListValid) {
            IsValidate = false;
        }
        const AuctionDateRequired = checkAuctionDate();
        if (AuctionDateRequired !== "") {
            IsValidate = false;
            // console.log("AuctionDateRequired", AuctionDateRequired)
            setAuctionDateError(AuctionDateRequired);
        } else {
            // console.log("AuctionDateRequired111", AuctionDateRequired)
            setAuctionDateError('');
        }
        console.log("ChitEstimateListAdd_submit", ChitEstimateListAdd)
        if (ChitEstimateList.length > 0 && ChitEstimateListAdd !== 0) {
            console.log("ChitEstimateList_submit", ChitEstimateList)
            ChitEstimateAddMethod(IsValidate);
        }
    };

    const validateChitEstimateList = () => {
        let isValid = true;
        setChitEstimateList(prevState =>
            prevState.map(estimate => {
                const updatedEstimate = { ...estimate };
                if (estimate.auctiondate === "") {
                    updatedEstimate.auctiondate_error = "* Required";
                    isValid = false;
                }
                if (estimate.dueamount === "") {
                    updatedEstimate.dueamount_error = "* Required";
                    isValid = false;
                }
                if (estimate.less_amount === "") {
                    updatedEstimate.less_amount_error = "* Required";
                    isValid = false;
                }
                if (estimate.fm_commission === "") {
                    updatedEstimate.fm_commission_error = "* Required";
                    isValid = false;
                }
                return updatedEstimate;
            })
        );
        return isValid;
    };

    const HandleAlertShow = () => {
        setAlertOpen(true);
    };

    const HandleAlertClose = () => {
        setAlertOpen(false);
        if (AlertFrom === "success") {
            window.location.reload();
            // navigate('/chitestimate/list');
        }
    }

    const HandleSubmitClick = () => {
        validateChitEstimateInfo();
    };

    const HandleDateChange = (date, from, item) => {
        setScreenRefresh(pre => pre + 1);
        setChitEstimateListAdd(pre => pre + 1);
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "0";
        // console.log('Date to save:', DateForSave);
        setChitEstimateList(prevState =>
            prevState.map(prev => {
                if (prev === item) {
                    const ids = String(item.id).startsWith('id_') ? item.id.replace(/^id_/, '') : item.id;
                    if (from === "auctiondate") {
                        return {
                            ...prev,
                            id: ids,
                            auctiondate: date,
                            auctiondate_save: DateForSave,
                            auctiondate_error: date ? "" : "* Required",
                        };
                    }
                }
                return prev;
            })
        );
    };

    const ensureNumber = (value) => {
        const num = parseFloat(value);
        return Number.isNaN(num) ? "" : num;
    };

    const ChitEstimateListTextValidate = (e, item, index, from) => {
        const text = e.target.value;
        const TextValue = text.trim() !== "" ? parseFloat(text) : ""; // Ensure TextValue is a number
        console.log(from);
        setChitEstimateList((prevState) =>
            prevState.map((prev, idx, array) => {
                if (text.trim() !== "") {
                    setChitEstimateListAdd((pre) => pre + 1);
                } else {
                    setChitEstimateListAdd(0);
                }

                const ids = String(item.id).startsWith('id_') ? item.id.replace(/^id_/, '') : item.id;
                let CaculateLessAmount = ensureNumber(prev.less_amount);
                let CaculatePayment = ensureNumber(prev.payment);
                let CaculateDueAmount = ensureNumber(prev.dueamount);
                let CaculateEditPayment = ensureNumber(prev.payment);
                const TextValueNumber = ensureNumber(TextValue);
                const DurationValue = ensureNumber(data.duration);
                const AmountValue = ensureNumber(data.amount);
                const EmDueValue = ensureNumber(data.emdue);
                console.log("DurationValue--> ", DurationValue, "TextValueNumber", TextValueNumber);
                if (data.divident_distribute === "Current Month") {
                    if (from === "dueamount") {
                        CaculateLessAmount = AmountValue - ((TextValueNumber * DurationValue) - ensureNumber(prev.fm_commission));
                        CaculateDueAmount = TextValueNumber;
                        CaculatePayment = (TextValueNumber * DurationValue) + ensureNumber(prev.fm_commission) + ensureNumber(prev.gst_value);
                        if (CaculateDueAmount > EmDueValue) {
                            CaculateDueAmount = "";
                            CaculatePayment = "";
                            CaculateLessAmount = "";
                            setAlertMessage("Due amount can't be greater than Em Due");
                            setAlertFrom("save_alert");
                            HandleAlertShow();
                        }
                        console.log("dueamount--> ", CaculateLessAmount, "CaculatePayment--> ", CaculatePayment);
                    } else if (from === "fm_commission") {
                        CaculateLessAmount = AmountValue - ((CaculateDueAmount * DurationValue) - TextValueNumber);
                        CaculatePayment = (CaculateDueAmount * DurationValue) - TextValueNumber - ensureNumber(prev.gst_value);
                        console.log("fm_commission--> ", CaculateDueAmount, "CaculatePayment--> ", CaculatePayment);
                    } else if (from === "less_amount") {
                        CaculateLessAmount = TextValueNumber;
                    }
                } else if (data.divident_distribute === "Next Month") {
                    if (from === "dueamount") {
                        if (index - 1 >= 0 && index + 1 < array.length) {
                            array[index - 1].less_amount = (data.amount ?? 0) - ((TextValueNumber ?? 0) * (DurationValue ?? 0) - (array[index + 1]?.fm_commission ?? 0));
                            array[index - 1].payment = ((TextValueNumber ?? 0) * (DurationValue ?? 0)) - ensureNumber(array[index - 1]?.fm_commission ?? 0) + ensureNumber(array[index - 1]?.gst_value ?? 0);
                        }
                        CaculateDueAmount = TextValueNumber ?? 0;
                        if (CaculateDueAmount > EmDueValue) {
                            CaculateDueAmount = 0;
                            setAlertMessage("Due amount can't be greater than Em Due");
                            setAlertFrom("save_alert");
                            HandleAlertShow();
                        }
                        console.log("dueamount1--> ", array[index - 1]?.less_amount || 0, "array[index - 1].payment", array[index - 1]?.payment || 0);
                    } else if (from === "fm_commission") {
                        if (index + 1 < array.length) {
                            CaculateLessAmount = data.amount - ((array[index + 1].dueamount * DurationValue) - TextValueNumber);
                            CaculatePayment = ((array[index + 1].dueamount || 0) * DurationValue) - TextValueNumber + ensureNumber(prev?.gst_value || 0);
                            console.log("fm_commission1--> ", CaculateLessAmount, "CaculatePayment", CaculatePayment);
                        }
                        // console.log("index--> ", index, " ChitEstimateList--> ", (ChitEstimateList.length - 1));
                        if (index === ChitEstimateList.length - 1){
                            CaculateEditPayment = AmountValue - TextValueNumber;
                            console.log("CaculateEditPayment--> ", CaculateEditPayment);
                        }
                    } else if (from === "less_amount") {
                        CaculateLessAmount = TextValue;
                    } else if (from === "payment") {
                        CaculatePayment = TextValue;
                    }
                }
                console.log(" Math.round(ensureNumber(prev.fm_commission))", ensureNumber(prev.fm_commission))
                if (prev === item) {
                    const PaymentDataSet = index === ChitEstimateList.length - 1 ? ensureNumber(CaculateEditPayment) : ensureNumber(CaculatePayment);
                    const PaymentDataFinalSet = (from === "payment") ? ensureNumber(CaculatePayment) : PaymentDataSet;
                    console.log("PaymentDataFinalSet--> ", PaymentDataFinalSet);
                    return {
                        ...prev,
                        id: ids,
                        dueamount: from === "dueamount" ? ensureNumber(CaculateDueAmount) : ensureNumber(prev.dueamount),
                        dueamount_error: from === "dueamount" && (ensureNumber(CaculateDueAmount) || ensureNumber(prev.dueamount)) === "" ? "* Required" : "",
                        less_amount: from === "less_amount" || from === "dueamount" || from === "fm_commission" ? ensureNumber(CaculateLessAmount) : ensureNumber(prev.less_amount),
                        less_amount_error: from === "less_amount" && (ensureNumber(CaculateLessAmount) || ensureNumber(prev.less_amount)) === "" ? "* Required" : "",
                        fm_commission: from === "fm_commission" ? ensureNumber(TextValue) : prev.fm_commission,
                        fm_commission_error: from === "fm_commission" && (ensureNumber(TextValue) || ensureNumber(prev.fm_commission)) === "" ? "* Required" : "",
                        gst_value: from === "gst_value" ? ensureNumber(TextValue) : ensureNumber(prev.gst_value),
                        doc_charge_value: from === "doc_charge_value" ? ensureNumber(TextValue) : ensureNumber(prev.doc_charge_value),
                        payment: from === "payment" || from === "dueamount" || from === "fm_commission" ? PaymentDataFinalSet : ensureNumber(prev.payment),
                    };
                }
                return prev;
            })
        );
    };

    const ChitEstimateMemberListTextValidate = (e, item, from) => {
        const text = e.target.value;
        // console.log(from);
        setChitEstimateMemberList(prevState =>
            prevState.map(prev => {
                if (text.trim() !== "") {
                    setScreenRefresh(pre => pre + 1);
                } else {
                    setScreenRefresh(0);
                }
                if (prev === item) {
                    if (from === "memberName") {
                        return {
                            ...prev,
                            memberName: text.trim() !== "" ? text : "",
                        };
                    }
                    if (from === "accno") {
                        return {
                            ...prev,
                            accno: text.trim() !== "" ? text : "",
                        };
                    }
                    if (from === "comments") {
                        return {
                            ...prev,
                            comments: text.trim() !== "" ? text : "",
                        };
                    }
                }
                return prev;
            })
        );
    };

    const HandleChitEstimateMemberAddClick = (item, index) => {
        setSelectGroupMemberList({
            add: index,
            remove: 0,
            remove_data: '',
        });
        setGroupMemberListAlert(true);
    }

    const HandleChitEstimateParticularUpdate = (item, index) => {
        console.log(item)
        if (typeof item.id === 'string' && item.id.includes('id_')) {
            console.log(item)
        } else {
            ChitEstimateMemberUpdateMethod(item.id, item);
        }

    }

    const HandleChitEstimateMemberDeleteClick = (item) => {
        setMemberDeleteClick(false);
        const updatedFirstItem = {
            ...ChitEstimateMemberList[SelectGroupMemberList.remove],
            member_id: "",
            comments: "",
            memberProfile: "",
            memberName: "",
            accno: "",
            action: "add"
        };
        const updatedList = [
            ...ChitEstimateMemberList.slice(0, SelectGroupMemberList.remove),
            updatedFirstItem,
            ...ChitEstimateMemberList.slice(SelectGroupMemberList.remove + 1)
        ];
        // console.log(updatedList);
        setChitEstimateMemberList(updatedList);
        if (typeof SelectGroupMemberList.remove_data.id === 'string' && SelectGroupMemberList.remove_data.id.includes('id_')) {
            // console.log(SelectGroupMemberList.remove_data.id);
        } else {
            ChitEstimateMemberDeleteMethod(SelectGroupMemberList.remove_data.id)
        }
    }

    const handleClick = (event, item) => {
        setScreenRefresh(pre => pre + 1);
        const selectedIndex = selected.indexOf(item.memberName);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item.memberName);
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
        // console.log(item);
        // console.log(ChitEstimateMemberList);
        const checkIdExists = id => ChitEstimateMemberList.some(items => items.member_id === id);
        const checkTktnoExists = tktno => ChitEstimateMemberList.some(items => String(items.ticket_no) === tktno);
        // console.log(checkIdExists(item.memberId), " -- ", checkTktnoExists(item.tktno));
        if (checkIdExists(item.memberId) && checkTktnoExists(item.tktno)) {
            setAlertMessage("Already this member is added");
            setAlertFrom("save_alert");
            HandleAlertShow();
        } else {
            const updatedFirstItem = {
                ...ChitEstimateMemberList[SelectGroupMemberList.add],
                member_id: item.memberId,
                comments: "",
                memberProfile: item.memberProfile,
                memberName: item.memberName,
                accno: item.memberId,
                action: "delete"
            };

            ChitEstimateMemberAddMethod(updatedFirstItem, "");
            setGroupMemberListAlert(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setTotalCount(0);
        setGroupMemberList([]);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const HandleGroupMemberListAlertClose = () => {
        setGroupMemberListAlert(false);
        setScreenRefresh(0);
    };

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setTotalCount(0);
        setGroupMemberList([]);
        setFilterName(event.target.value);
    };

    const HandleFilterTicketNo = (event) => {
        setPage(0);
        setTotalCount(0);
        setGroupMemberList([]);
        setfilterTicketNo(event.target.value);
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitestimate/list');
            }
        } else {
            navigate('/chitestimate/list');
        }
    }

    const checkAuctionDate = () => {
        const hasEmptyFields = ChitEstimateList.some(estimate => estimate.auctiondate === "" || estimate.auctiondate === null);
        // console.log("hasEmptyFields", hasEmptyFields);
        if (hasEmptyFields) {
            return "* Auction Date is Required";
        }
        return "";
    };

    const CustomTextField = styled(TextField)(({ theme }) => ({
        '& .MuiInputBase-root': {
            borderBottom: '1px solid',
            borderRadius: 5,
            padding: '4px',
            backgroundColor: 'transparent',
            fontSize: '0.75rem',
            height: '25px',
            width: '100%',
        },
        '& .MuiInputBase-input': {
            padding: '0 4px',
            minWidth: 0,
            fontSize: '0.75rem',
        },
        '& .MuiSvgIcon-root': {
            fontSize: '1rem',
        },
    }));

    const HandlePreviousScreen = () => {
        navigate('/chitestimate/list');
    }

    if (!location.state) {
        return <ScreenError HandlePreviousScreen={HandlePreviousScreen} />
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <div style={{ marginLeft: '35px', marginRight: '35px' }}>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    Chit Estimate
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card className='parent-div'>

                <Box component="form"
                    sx={{ '& .MuiTextField-root': {} }} noValidate autoComplete="off">
                    <Stack direction='column'>
                        <Stack direction='row' spacing={1} alignItems='center' gap='20px' justifyContent="flex-start" sx={{ m: 3, mb: 2 }} className='estimate-box'>
                            <div className='estimate-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '7px' }}>
                                        Group No
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                        <TextField
                                            className='input'
                                            id="outlined-required"
                                            disabled
                                            value={GroupNo.data}
                                            onChange={(e) => ChitEstimateTextValidate(e, "GroupNo")}
                                            sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px', } }} />
                                    </Stack>
                                    <div className='error_txt'>{GroupNo.error}</div>
                                </Stack>
                            </div>
                            <div className='estimate-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ mt: 0, ml: 0, mb: '7px' }}>
                                        Foreman Pr.Due
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                        <TextField
                                            className='input'
                                            id="outlined-required"
                                            disabled
                                            value={ForemanPrDue.data}
                                            onChange={(e) => ChitEstimateTextValidate(e, "ForemanPrDue")}
                                            sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px', } }} />
                                    </Stack>
                                    <div className='error_txt'>{ForemanPrDue.error}</div>
                                    </Stack>
                            </div>
                            <div className='estimate-grp'>
                                <Stack direction='column'>
                                    <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 0, mb: '7px' }}>
                                        Amount <span style={{ color: 'red' }}> *</span>
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input'
                                            id="outlined-required"
                                            disabled
                                            value={Amount.data}
                                            onChange={(e) => ChitEstimateTextValidate(e, "Amount")}
                                            sx={{ '& .MuiInputBase-input': { padding: '8px', ontSize: '14px', } }} />
                                    </Stack>
                                    <div className='error_txt'>{Amount.error}</div>
                                </Stack>
                            </div>
                            <div className='estimate-grp'>
                                <Stack direction='column' >
                                    <Typography variant="subtitle1" sx={{ ml: 0, mr: 0, mt: 0, mb: '7px' }}>
                                        Dividend <span style={{ color: 'red' }}> *</span>
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input'
                                            id="outlined-required"
                                            disabled
                                            value={Dividend.data}
                                            onChange={(e) => ChitEstimateTextValidate(e, "Dividend")}
                                            sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px', } }} />
                                    </Stack>
                                    <div  className='error_txt'>{Dividend.error}</div>
                                </Stack>
                            </div>
                            <div className='estimate-grp'>
                                <Stack direction='column'>
                                    <Typography variant='subtitle1' sx={{ mt: 0, ml: 0, mb: '7px' }} >
                                        Duration
                                    </Typography>
                                    <Stack direction='row' sx={{ ml: 0, }}>
                                        <TextField
                                            className='input'
                                            id="outlined-required"
                                            disabled
                                            value={Duration.data}
                                            onChange={(e) => ChitEstimateTextValidate(e, "Duration")}
                                            sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px', } }} />
                                    </Stack>
                                    <div className='error_txt'>{Duration.error}</div>
                                </Stack>
                            </div>
                        </Stack>
                    </Stack>
                </Box>
                {ChitEstimateLoading || ChitEstimateMemberLoading
                    ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                    </Stack>
                    : 
                <Grid container spacing={1}  className='grid-container'>
                    <Grid item xs={12} md={6} className='box-one' >
                        <Scrollbar className="table-one tab-1" >
                            <Stack>
                                <TableContainer>
                                    <Table className='tab-wid' >
                                        <TableRow hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Inst.No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Auc.Date</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Due.Amt</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Less.Amt</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>FM.com.Amt</TableCell>
                                            {/* <TableCell className='heading_width' sx={{ background: '#edf4fe', color: '#1877f2', }}
                                            >GST</TableCell> */}
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Payment</TableCell>
                                        </TableRow>
                                        <TableBody className='tab-body'>
                                            {ChitEstimateList
                                                .map((row, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                        <TableCell className='no' > {row.Instno}
                                                        </TableCell>
                                                        <TableCell
                                                            className='date-column'> <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                                <DatePicker
                                                                    id="filled-hidden-label-normal"
                                                                    value={row.auctiondate != null ? dayjs(row.auctiondate) : null}
                                                                    onChange={(e) => HandleDateChange(e, "auctiondate", row)}
                                                                    format="DD-MM-YYYY"
                                                                    renderInput={(params) => (
                                                                        <CustomTextField
                                                                            {...params}
                                                                            variant="filled" />

                                                                    )}
                                                                    sx={{
                                                                        '& .MuiInputBase-input': {
                                                                            padding: '2px', fontSize: '12px',

                                                                        },
                                                                        '& .MuiOutlinedInput-root': {
                                                                            paddingRight: '2px',
                                                                        },
                                                                        '& .MuiOutlinedInput-input': {
                                                                            width: '78px'
                                                                        },
                                                                        '& .MuiInputAdornment-root': { padding: '2px', },
                                                                        '& .MuiButtonBase-root': { padding: '2px', width: '40px' },
                                                                        '& .MuiSvgIcon-root': {
                                                                            fontSize: '18px',
                                                                            paddingRight: '4px',
                                                                            alignContent: 'center'
                                                                        }
                                                                    }} />
                                                            </LocalizationProvider>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                error={(row.dueamount_error && row.dueamount_error !== "")}
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                className='input-box'
                                                                value={row.dueamount}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "dueamount")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '1px', }
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                        //  sx={{ width: '14%' }}
                                                        >
                                                            <TextField
                                                                className='input-box'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                error={(row.less_amount_error && row.less_amount_error !== "")}
                                                                value={row.less_amount}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "less_amount")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', }
                                                                }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                error={(row.fm_commission_error && row.fm_commission_error !== "")}
                                                                className='input-box'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.fm_commission}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "fm_commission")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', }
                                                                }} />
                                                        </TableCell>
                                                        {/* <TableCell className='cell_width'>
                                                            <TextField
                                                                className='input-box3'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                disabled
                                                                value={row.gst_value != null && row.gst_value !== "" ? Math.round(row.gst_value) : ""}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "gst_value")}
                                                                sx={{

                                                                    backgroundColor: 'transparent',

                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                        // width:'50px'
                                                                    },

                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', },


                                                                }} />
                                                        </TableCell> */}
                                                        <TableCell >                                                                                 
                                                            <TextField
                                                                className='input-box'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.payment}
                                                                disabled={index !== ChitEstimateList.length - 1}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "payment")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', }
                                                                }} />
                                                        </TableCell>
                                                    </TableRow>))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(0, 15, ChitEstimateList.length)} />
                                            {ChitEstimateList.length === 0 && <TableNoData query="" />}
                                        </TableBody>
                                        {/* <div
                                            style={{ marginTop: "16px" }} /> */}
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Scrollbar>
                        <div className='error_txt date_error' fontSize={12}>
                            {AuctionDateError}</div>

                    </Grid>
                    <Grid item xs={12} md={6} className='box-one'>
                        <Scrollbar className="table-one table-two">
                            <TableContainer >
                                <Stack >
                                    <Table >
                                        <TableRow hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} >Inst.No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Tkt.No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Image</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Name</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Acc No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Particulars</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Action</TableCell>
                                        </TableRow>
                                        <TableBody>
                                            {ChitEstimateMemberList
                                                .map((row, index) => (
                                                    <TableRow className='row-height'

                                                        hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                        <TableCell className='no '>{row.install_no}</TableCell>
                                                        <TableCell className='no1'>{row.ticket_no}</TableCell>
                                                        <TableCell>
                                                            {row.memberProfile !== "" && row.memberProfile !== null && row.memberProfile !== undefined
                                                                ? <div>
                                                                    <img src={`${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${row.memberProfile}`} alt="Loading" style={{ width: 33, height: 33, }} />
                                                                </div>
                                                                : <div>
                                                                    <img src="/assets/images/img/placeholder.png" alt="Loading" style={{ width: 33, height: 33, }} />
                                                                </div>}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                className='input-box4'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                disabled
                                                                value={row.memberName}
                                                                onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "memberName")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },
                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', }
                                                                }} />
                                                        </TableCell>
                                                        <TableCell className='accno-width'>
                                                            <TextField
                                                                className='input-box acc-width'
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                disabled
                                                                value={String(row.id).startsWith('id_') ? row.accno : row.id}
                                                                onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "accno")}
                                                                sx={{

                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': { backgroundColor: 'transparent', },
                                                                        '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                        '&.Mui-disabled': { backgroundColor: 'transparent', },

                                                                    },
                                                                    '& .Mui-disabled': { '-webkit-text-fill-color': 'currentColor', },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '2px', fontSize: '12px',

                                                                    },
                                                                    '& .MuiInputAdornment-root': { padding: '2px', }
                                                                }} />
                                                        </TableCell>
                                                        <TableCell >
                                                            <Grid container>
                                                                <Grid item xs={10} >
                                                                    <TextField
                                                                        className='input-box4 particular-text'
                                                                        id="filled-hidden-label-normal"
                                                                        variant="filled"
                                                                        value={row.comments}
                                                                        onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "comments")}

                                                                        sx={{
                                                                            backgroundColor: 'transparent',
                                                                            '& .MuiFilledInput-root': {
                                                                                backgroundColor: 'transparent',
                                                                                '&:hover': { backgroundColor: 'transparent', },
                                                                                '&.Mui-focused': { backgroundColor: 'transparent', },
                                                                                paddingInlineEnd: '2px',
                                                                            },
                                                                            '& .MuiInputBase-input': { padding: '2px', fontSize: '12px', },
                                                                            '& .MuiInputAdornment-root': { padding: '2px', },
                                                                        }} />

                                                                </Grid>
                                                                <Grid item xs={2} >
                                                                    <IconButton

                                                                        onClick={() => HandleChitEstimateParticularUpdate(row, index)} sx={{
                                                                            cursor: 'pointer',
                                                                            py: '2px', px: '1px'
                                                                        }}>
                                                                        <Iconify icon="charm:tick" style={{ color: "#05e147", width: 15, height: 18, }} className='icon-width' />
                                                                    </IconButton></Grid>

                                                            </Grid>


                                                        </TableCell>
                                                        <TableCell >

                                                            {row.action === "add"
                                                                ? <IconButton
                                                                    className='icon-button'
                                                                    onClick={() => HandleChitEstimateMemberAddClick(row, index)} sx={{
                                                                        cursor: 'pointer',

                                                                    }} InputProps={{ padding: '2px' }}>
                                                                    <Iconify padding='2px'
                                                                        icon="icon-park-solid:add-one" />
                                                                </IconButton>
                                                                : ((row.install_no !== 1) && <IconButton onClick={() => {
                                                                    setMemberDeleteClick(true); setSelectGroupMemberList({
                                                                        add: 0,
                                                                        remove: index,
                                                                        remove_data: row,
                                                                    });
                                                                }} sx={{ cursor: 'pointer' }}>
                                                                    <Iconify icon="streamline:delete-1-solid" sx={{ width: 11, height: 11 }} />
                                                                </IconButton>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(0, 15, ChitEstimateMemberList.length)}
                                            />
                                            {ChitEstimateMemberList.length === 0 && <TableNoData query="" />}
                                        </TableBody>
                                    </Table>
                                </Stack>
                            </TableContainer>
                        </Scrollbar>


                    </Grid>
                </Grid> }
                {ChitEstimateLoading || ChitEstimateMemberLoading
                    ? null 
                : <Stack direction='column' className='sub-button' >
                    <Button variant="contained" className='custom-button  submit-button ' onClick={Loading ? null : HandleSubmitClick}>
                        {Loading
                            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                            : ("Submit")}
                    </Button>
                </Stack> }


            </Card>
            <Dialog
                open={GroupMemberListAlert}
                // fullWidth
                maxWidth='md'
                sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card 
                // sx={{ maxWidth: '900px' }}
                >
                    <Stack>
                        <Stack ml={1} mr={1} pb={1} direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 1 }} stick>
                                    Group Member List
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                onClick={HandleGroupMemberListAlertClose}
                                sx={{ position: 'absolute', right: 10, top: 11, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14 }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 1, mb: 1 }}  />

                        <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center" gap='10px'>
                            <TextField
                                placeholder="Member Name..."
                                value={FilterName}
                                onChange={(e) => HandleFilterMemberName(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, mt: 1, mb: 1, width: 16, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '8px',
                                        fontSize: '14px'
                                    },
                                    '& .MuiInputAdornment-root': {
                                        padding: '8px',
                                    },
                                }}
                            />
                            <TextField
                                placeholder="Ticket No..."
                                value={filterTicketNo}
                                onChange={(e) => HandleFilterTicketNo(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, width: 16, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    ml: 0,
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
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 0.5 }}>
                            <Scrollbar style={{ maxHeight: '70vh' }}>
                                <div style={{ marginLeft: '15px', marginRight: '15px' }}>
                                    <TableContainer sx={{ overflow: '', mt: 2 }}>
                                        <Table sx={{ minWidth: 500 }} stickyHeader>
                                            <TableRow hover tabIndex={-1}>
                                                <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                                <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Account No</TableCell>
                                                <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Ticket No</TableCell>
                                            </TableRow>
                                            {GroupMemberListLoading
                                                ? <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                        <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                    </TableCell>
                                                </TableRow>
                                                : <TableBody>
                                                    {GroupMemberList
                                                        .map((row) => {
                                                            const checkIdExists = id => ChitEstimateMemberList.some(items => items.member_id === id);
                                                            const checkTktnoExists = tktno => ChitEstimateMemberList.some(items => String(items.ticket_no) === tktno);
                                                            return (
                                                                <TableRow hover={!checkIdExists(row.memberId) || !checkTktnoExists(row.tktno)} tabIndex={-1} role="checkbox" selected={selected.indexOf(row.name) !== -1}
                                                                    className={(checkIdExists(row.memberId) && checkTktnoExists(row.tktno)) && 'rowExists'} onClick={(event) => handleClick(event, row)}>
                                                                    <TableCell>{row.memberName}</TableCell>
                                                                    <TableCell>{row.memberId}</TableCell>
                                                                    <TableCell>{row.tktno}</TableCell>
                                                                </TableRow>)
                                                        })}
                                                    <TableEmptyRows
                                                        height={77}
                                                        emptyRows={emptyRows(page, 5, GroupMemberList.length)} />
                                                    {GroupMemberList.length === 0 && <TableNoData query={FilterName} />}
                                                </TableBody>}
                                        </Table>
                                    </TableContainer>
                                </div>
                                {GroupMemberList.length > 0 && <TablePagination
                                    page={page}
                                    component="div"
                                    count={TotalCount}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={handleChangePage}
                                    rowsPerPageOptions={[10, 15, 30, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{ borderTop: '1px solid #e0e0e0' }} />}
                            </Scrollbar>
                        </Box>
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={MemberDeleteClick}
                maxWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <DialogTitle id="responsive-dialog-title">
                    Are you sure you want to delete this Chit Estimate Member ?
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={HandleChitEstimateMemberDeleteClick} sx={{ cursor: 'pointer' }}>
                        Yes
                    </Button>
                    <Button onClick={() => setMemberDeleteClick(false)} autoFocus sx={{ cursor: 'pointer' }}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={MemberUpdateLoading}
                onClose={() => setMemberUpdateLoading(false)}
                fullWidth={500}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }} >
                <Stack style={{ alignItems: 'center' }} mt={5} mb={5}>
                    <img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 70, height: 70 }} />
                </Stack>
            </Dialog>
            <Portal>
            <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "save_alert" ? 2000 : 1000} onClose={HandleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
                <Alert
                    onClose={HandleAlertClose}
                    severity={AlertFrom === "failed" || AlertFrom === "save_alert" ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }} >
                    {AlertMessage}
                </Alert>
            </Snackbar>
            </Portal>
        </div>
    );
}