import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Alert, Button, Dialog, styled, Snackbar, Typography, IconButton, DialogTitle, DialogActions, InputAdornment, TablePagination } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, DeleteHeader, } from 'src/hooks/AxiosApiFetch';

import { MEMBER_VIEW, GROUP_MEMBER_LIST, CHIT_ESTIMATE_SAVE, REACT_APP_HOST_URL, CHIT_ESTIMATE_LIST, STANDING_INSTRUCTION, CHIT_ESTIMATE_UPDATE, CHIT_ESTIMATE_DELETE, CHIT_ESTIMATE_MEMBER_LIST, CHIT_ESTIMATE_MEMBER_SAVE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './chitestimate-add.css';
import { emptyRows } from '../member/utils';
import TableHeader from '../member/table-head';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';

export default function AddChitEstimatePage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
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
    const [ChitEstimateLoading, setChitEstimateLoading] = useState(false);
    const [ChitEstimateList, setChitEstimateList] = useState([]);
    const [ChitEstimateMemberLoading, setChitEstimateMemberLoading] = useState(false);
    const [ChitEstimateMemberList, setChitEstimateMemberList] = useState([]);
    const [ChitEstimateListAdd, setChitEstimateListAdd] = useState(0);
    const [ChitEstimateMemberListAdd, setChitEstimateMemberListAdd] = useState(false);
    const [MemberDeleteClick, setMemberDeleteClick] = useState(false);

    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [GroupMemberListAlert, setGroupMemberListAlert] = useState(false);
    const [GroupMemberListLoading, setGroupMemberListLoading] = useState(true);
    const [GroupMemberList, setGroupMemberList] = useState([]);
    const [TotalCount, setTotalCount] = useState(0);
    const [FilterName, setFilterName] = useState('');
    const [filterTicketNo, setfilterTicketNo] = useState('');
    const [SelectGroupMemberList, setSelectGroupMemberList] = useState({
        add: 0,
        add_data: '',
        remove: 0,
        remove_data: '',
        member_edit: 'false'
    });

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
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_LIST}${data.id}`;
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
                        less_amount: "0",
                        fm_commission: "0",
                        gst_value: "0",
                        doc_charge_value: "0",
                        payment: "0"
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

    const GetChitEstimateMemberList = () => {
        setChitEstimateMemberLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_MEMBER_LIST}${data.id}`;
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
                        add_data: json.list && json.list[0] ? json.list[0] : "",
                        remove: 0,
                        remove_data: '',
                        member_edit: 'false'
                    });
                    if(json.list.length === 0){
                        GetStandingInstructionList(completeList);
                    }else{
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
                            accno: json.list.accno,
                            action: "delete"
                        };
                        const updatedList = [updatedFirstItem, ...datas.slice(1)];
                        // console.log('Updated list after updating first item:', updatedList);
                        setSelectGroupMemberList({
                            add: 0,
                            add_data: updatedFirstItem,
                            remove: 0,
                            remove_data: '',
                            member_edit: 'true'
                        });
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
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?groupId=${data.id}&memberName=${membername}&tktNo=${ticketno}&start=${start}&limit=${limit}`;
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
                    setChitEstimateMemberListAdd(false);
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

    const ChitEstimateMemberAddMethod = () => {
        setLoading(true);
        const ChitEstimateMemberListParams = {
            "id": 0,
            "group_id": ChitEstimateMemberList[SelectGroupMemberList.add].group_id,
            "install_no": ChitEstimateMemberList[SelectGroupMemberList.add].install_no,
            "ticket_no": ChitEstimateMemberList[SelectGroupMemberList.add].ticket_no,
            "member_id": ChitEstimateMemberList[SelectGroupMemberList.add].member_id,
            "tkt_suffix": "A",
            "tkt_percentage": "100",
            "is_active": ChitEstimateMemberList[SelectGroupMemberList.add].is_active,
            "comments": ChitEstimateMemberList[SelectGroupMemberList.add].comments
        };
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_MEMBER_SAVE}`;
        console.log(JSON.stringify(ChitEstimateMemberListParams) + url);
        fetch(url, PostHeader(JSON.parse(Session), ChitEstimateMemberListParams))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setLoading(false);
                setScreenRefresh(0);
                setChitEstimateMemberListAdd(false);
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
                setChitEstimateMemberListAdd(false);
                setLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitEstimateMemberUpdateMethod = (id) => {
        setLoading(true);
        const ChitEstimateMemberListParams = {
            "id": 0,
            "group_id": ChitEstimateMemberList[SelectGroupMemberList.add].group_id,
            "install_no": ChitEstimateMemberList[SelectGroupMemberList.add].install_no,
            "ticket_no": ChitEstimateMemberList[SelectGroupMemberList.add].ticket_no,
            "member_id": ChitEstimateMemberList[SelectGroupMemberList.add].member_id,
            "tkt_suffix": "A",
            "tkt_percentage": "100",
            "is_active": ChitEstimateMemberList[SelectGroupMemberList.add].is_active,
            "comments": ChitEstimateMemberList[SelectGroupMemberList.add].comments
        };
        const url = `${REACT_APP_HOST_URL}${CHIT_ESTIMATE_UPDATE}${id}`;
        console.log(JSON.stringify(ChitEstimateMemberListParams) + url);
        fetch(url, PutHeader(JSON.parse(Session), ChitEstimateMemberListParams))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setLoading(false);
                setScreenRefresh(0);
                setChitEstimateMemberListAdd(false);
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
                setChitEstimateMemberListAdd(false);
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
                    setAlertFrom("remove_success");
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
        if (ChitEstimateList.length > 0 && ChitEstimateListAdd !== 0){
            ChitEstimateAddMethod(IsValidate);
        }
        if (SelectGroupMemberList.member_edit === 'true') {
            if (ChitEstimateMemberList.length > 0) {
                // console.log(SelectGroupMemberList)
                if (typeof SelectGroupMemberList.add_data.id === 'string' && SelectGroupMemberList.add_data.id.includes('id_')) {
                    ChitEstimateMemberAddMethod();
                } else {
                    ChitEstimateMemberUpdateMethod(SelectGroupMemberList.add_data.id);
                }
            }
        }
    }

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

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = ChitEstimateList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
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
                        };
                    }
                }
                return prev;
            })
        );
    };

    const ChitEstimateListTextValidate = (e, item, index, from) => {
        const text = e.target.value;
        const TextValue = text.trim() !== "" ? parseFloat(text) : 0; // Ensure TextValue is a number
        console.log(from);
        setChitEstimateList(prevState =>
            prevState.map((prev, idx, array) => {
                if (text.trim() !== "") {
                    setChitEstimateListAdd(pre => pre + 1);
                } else {
                    setChitEstimateListAdd(0);
                }

                const ids = String(item.id).startsWith('id_') ? item.id.replace(/^id_/, '') : item.id;
                let CaculateLessAmount = prev.less_amount;
                let CaculatePayment = prev.payment;
                let CaculateDueAmount = prev.dueamount;
                console.log("data.emdue--> ", data.emdue);
                if (data.divident_distribute === "Current Month") {
                    if (from === "dueamount") {
                        CaculateLessAmount = data.amount - (TextValue * data.duration) - prev.fm_commission;
                        CaculateDueAmount = TextValue;
                        console.log("CaculateLessAmount--> ", CaculateLessAmount);
                    } else if (from === "fm_commission") {
                        console.log("TextValue--> ", TextValue);
                        CaculateLessAmount = prev.less_amount;
                        CaculateDueAmount = data.emdue - ((CaculateLessAmount - TextValue) / data.duration);
                        console.log("CaculateDueAmount--> ", CaculateDueAmount);
                    } else if (from === "less_amount") {
                        console.log("TextValue--> ", TextValue);
                        CaculateLessAmount = TextValue;
                        CaculateDueAmount = data.emdue - ((TextValue - prev.fm_commission) / data.duration);
                        console.log("CaculateDueAmount--> ", CaculateDueAmount);
                    }
                    CaculatePayment = data.amount - CaculateLessAmount - prev.gst_value - prev.doc_charge_value;
                    console.log("CaculatePayment--> ", CaculatePayment);
                } else if (data.divident_distribute === "Next Month") {
                    if (from === "dueamount") {
                        if (index - 1 >= 0 && index + 1 < array.length) {
                            array[index - 1].dueamount = data.amount - (TextValue * data.duration) - array[index + 1].fm_commission;
                        }
                        CaculateDueAmount = TextValue;
                        console.log("CaculateLessAmount--> ", CaculateLessAmount);
                    } else if (from === "fm_commission") {
                        if (index + 1 < array.length) {
                            console.log("TextValue--> ", TextValue);
                            CaculateLessAmount = ((data.emdue - array[index + 1].dueamount) * data.duration) + TextValue;
                            console.log("CaculateDueAmount--> ", CaculateDueAmount);
                        }
                    } else if (from === "less_amount") {
                        if (index + 1 < array.length) {
                            console.log("TextValue--> ", TextValue);
                            CaculateLessAmount = TextValue;
                            array[index + 1].dueamount = data.emdue - ((TextValue - prev.fm_commission) / data.duration);
                            console.log("CaculateDueAmount--> ", CaculateDueAmount);
                        }
                    }
                    CaculatePayment = data.amount - CaculateLessAmount - prev.gst_value - prev.doc_charge_value;
                    console.log("CaculatePayment--> ", CaculatePayment);
                }
                if (prev === item) {
                    return {
                        ...prev,
                        id: ids,
                        dueamount: from === "dueamount" || from === "fm_commission" ? Math.round(CaculateDueAmount) : prev.dueamount,
                        less_amount: from === "less_amount" || from === "dueamount" ? Math.round(CaculateLessAmount) : prev.less_amount,
                        fm_commission: from === "fm_commission" ? TextValue : prev.fm_commission,
                        gst_value: from === "gst_value" ? TextValue : prev.gst_value,
                        doc_charge_value: from === "doc_charge_value" ? TextValue : prev.doc_charge_value,
                        payment: from === "payment" || from === "dueamount" || from === "fm_commission" ? Math.round(CaculatePayment) : prev.payment,
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
                setSelectGroupMemberList(prevs => ({
                    ...prevs,
                    member_edit: 'true'
                }));
                if(text.trim() !== ""){
                    setScreenRefresh(pre => pre + 1);
                }else{
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
        setChitEstimateMemberListAdd(true);
        if(ChitEstimateMemberListAdd){
            setAlertMessage("please save the already selected Member");
            setAlertFrom("save_alert");
            HandleAlertShow();
        }else{
            setSelectGroupMemberList({
                add: index,
                add_data: item,
                remove: 0,
                remove_data: '',
                member_edit: 'true'
            });
            setGroupMemberListAlert(true);
        }
    }

    const HandleChitEstimateMemberDeleteClick = (item) => {
        setMemberDeleteClick(false);
        setChitEstimateMemberListAdd(false);
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
        if (typeof SelectGroupMemberList.remove_data.id === 'string' && SelectGroupMemberList.remove_data.id.includes('id_')){
            // console.log(SelectGroupMemberList.remove_data.id);
        }else{
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
        if (checkIdExists(item.memberId)) {
            setChitEstimateMemberListAdd(false);
            setAlertMessage("Already this member is added");
            setAlertFrom("save_alert");
            HandleAlertShow();
        }else{
            const updatedFirstItem = {
                ...ChitEstimateMemberList[SelectGroupMemberList.add],
                member_id: item.memberId,
                comments: "",
                memberProfile: item.memberProfile,
                memberName: item.memberName,
                accno: item.accno,
                action: "delete"
            };
            const updatedList = [
                ...ChitEstimateMemberList.slice(0, SelectGroupMemberList.add),
                updatedFirstItem,
                ...ChitEstimateMemberList.slice(SelectGroupMemberList.add + 1)
            ];
            console.log(updatedList);
            setChitEstimateMemberList(updatedList);
            setSelectGroupMemberList(prevs => ({
                ...prevs,
                member_edit: 'true'
            }));
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
        setChitEstimateMemberListAdd(false);
        setSelectGroupMemberList(prevs => ({
            ...prevs,
            member_edit: 'false'
        }));
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

    const CustomTextField = styled(TextField)(({ theme }) => ({
        '& .MuiInputBase-root': {
            borderBottom: '1px solid',
            borderRadius: 0,
            padding: '4px',
            backgroundColor: 'transparent',
            fontSize: '0.75rem',
            height: '32px',
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
    
    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    Chit Estimate
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box className="con" component="form"
                    sx={{
                        '& .MuiTextField-root': {  width: '20ch', },
                    }}
                    noValidate
                    autoComplete="off">
                    {ChitEstimateLoading || ChitEstimateMemberLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={1} alignItems='center' gap='20px' justifyContent="center" className='stack-box1'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 2, mb: '7px' }}>
                                            Group No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Group No"
                                                value={GroupNo.data}
                                                onChange={(e) => ChitEstimateTextValidate(e, "GroupNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 0, mb:'7px' }}>
                                            Foreman Pr.Due
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Foreman Pr.Due"
                                                value={ForemanPrDue.data}
                                                onChange={(e) => ChitEstimateTextValidate(e, "ForemanPrDue")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{ForemanPrDue.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 2, mb: '7px' }}>
                                            Amount
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Amount"
                                                value={Amount.data}
                                                onChange={(e) => ChitEstimateTextValidate(e, "Amount")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Amount.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 0, mr: 2, mt: 2, mb: '7px' }}>
                                            Dividend
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Dividend"
                                                value={Dividend.data}
                                                onChange={(e) => ChitEstimateTextValidate(e, "Dividend")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Dividend.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 0,mb:'7px'}} >
                                            Duration
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Duration"
                                                value={Duration.data}
                                                onChange={(e) => ChitEstimateTextValidate(e, "Duration")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Duration.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Scrollbar>
                                <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
                                    <Table sx={{ minWidth: 450 }}>
                                        <TableHeader
                                            order="asc"
                                            orderBy="name"
                                            rowCount={ChitEstimateList.length}
                                            numSelected={0}
                                            onRequestSort={handleSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            headLabel={[
                                                { id: 'Inst.No', label: 'Inst.No' },
                                                { id: 'Auc.Date', label: 'Auc.Date' },
                                                { id: 'Due.Amt', label: 'Due.Amt' },
                                                { id: 'Less.Amt', label: 'Less.Amt' },
                                                { id: 'FM.com.Amt', label: 'FM.com.Amt' },
                                                { id: 'GST', label: 'GST' },
                                                { id: 'Payment', label: 'Payment' },
                                            ]} />
                                        <TableBody>
                                            {ChitEstimateList
                                                .map((row, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                        <TableCell>{row.Instno}</TableCell>
                                                        <TableCell sx={{ width: 100 }}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DemoContainer components={['DatePicker']} sx={{ width: 250, overflow: 'hidden' }}>
                                                                    <DatePicker
                                                                        id="filled-hidden-label-normal"
                                                                        value={row.auctiondate != null ? dayjs(row.auctiondate) : null}
                                                                        onChange={(e) => HandleDateChange(e, "auctiondate", row)}
                                                                        format="DD-MM-YYYY"
                                                                        renderInput={(params) => (
                                                                            <CustomTextField
                                                                                {...params}
                                                                                variant="filled"
                                                                            />
                                                                        )}
                                                                    />
                                                                </DemoContainer>
                                                            </LocalizationProvider>
                                                        </TableCell>
                                                        <TableCell sx={{ ml: -2 , width: 20 }}>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.dueamount}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "dueamount")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }} />  
                                                        </TableCell>
                                                        <TableCell sx={{  width: 20 }}>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.less_amount}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "less_amount")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }} />
                                                        </TableCell>
                                                        <TableCell sx={{  width: 20 }}>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.fm_commission}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "fm_commission")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }} />
                                                        </TableCell>
                                                        <TableCell sx={{  width: 20 }}>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.gst_value}
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "gst_value")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }} />
                                                        </TableCell>
                                                        <TableCell sx={{  width: 20 }}>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.payment}
                                                                disabled
                                                                onChange={(e) => ChitEstimateListTextValidate(e, row, index, "payment")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }}/>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(0, 15, ChitEstimateList.length)}
                                            />
                                            {ChitEstimateList.length === 0 && <TableNoData query="" />}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                            <Scrollbar>
                                <TableContainer sx={{ overflow: 'unset' }}>
                                    <Table sx={{ minWidth: 450 ,mt:5}}>
                                        <TableHeader
                                            order="asc"
                                            orderBy="name"
                                            rowCount={ChitEstimateMemberList.length}
                                            numSelected={0}
                                            onRequestSort={handleSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            headLabel={[
                                                { id: 'Inst.No', label: 'Inst.No' },
                                                { id: 'Tkt.No', label: 'Tkt.No' },
                                                { id: 'Image', label: 'Image' },
                                                { id: 'Name', label: 'Name' },
                                                { id: 'Acc No', label: 'Acc No' },
                                                { id: 'Particulars', label: 'Particulars' },
                                                { id: 'Action', label: 'Action' },
                                            ]} />
                                        <TableBody>
                                            {ChitEstimateMemberList
                                                .map((row, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                        <TableCell>{row.install_no}</TableCell>
                                                        <TableCell>{row.ticket_no}</TableCell>
                                                        <TableCell>
                                                            {row.memberProfile !== "" && row.memberProfile !== null && row.memberProfile !== undefined
                                                                ? <div>
                                                                    <img src={`${ImageUrl.STORAGE_NAME}${ImageUrl.BUCKET_NAME}/${row.memberProfile}`} alt="Loading" style={{ width: 40, height: 40, }} />
                                                                </div>
                                                                : <div>
                                                                    <img src="/assets/images/img/placeholder.png" alt="Loading" style={{ width: 40, height: 40, }} />
                                                                </div>}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                disabled
                                                                value={row.memberName}
                                                                onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "memberName")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    },
                                                                }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                disabled
                                                                value={row.accno}
                                                                onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "accno")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                    '& .Mui-disabled': {
                                                                        '-webkit-text-fill-color': 'currentColor',
                                                                    }, }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                id="filled-hidden-label-normal"
                                                                variant="filled"
                                                                value={row.comments}
                                                                onChange={(e) => ChitEstimateMemberListTextValidate(e, row, "comments")}
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '& .MuiFilledInput-root': {
                                                                        backgroundColor: 'transparent',
                                                                        '&:hover': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                        '&.Mui-focused': {
                                                                            backgroundColor: 'transparent',
                                                                        },
                                                                    },
                                                                }} />
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.action === "add"
                                                                ? <IconButton onClick={() => HandleChitEstimateMemberAddClick(row, index)} sx={{ cursor: 'pointer' }}>
                                                                    <Iconify icon="icon-park-solid:add-one" />
                                                                </IconButton>
                                                                : (row.install_no !== 1 && <IconButton onClick={() => {
                                                                    setMemberDeleteClick(true); setSelectGroupMemberList({
                                                                        add: 0,
                                                                        add_data: '',
                                                                        remove: index,
                                                                        remove_data: row,
                                                                        member_edit: 'false'
                                                                    });}} sx={{ cursor: 'pointer' }}>
                                                                    <Iconify icon="streamline:delete-1-solid" />
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
                                </TableContainer>
                            </Scrollbar>
                            <Stack direction='column' alignItems='flex-end'>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>
                            </Stack>
                        </Stack>}
                </Box>
            </Card>
            <Dialog
                open={GroupMemberListAlert}
                fullWidth
                maxWidth="md"
                sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card sx={{ maxWidth: '800px' }}>
                    <Stack sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 5, mt: 2 }}>
                            Group Member List
                        </Typography>
                        <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center">
                            <TextField
                                placeholder="Member Name..."
                                value={FilterName}
                                onChange={(e) => HandleFilterMemberName(e)}
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
                            />
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
                                onClick={HandleGroupMemberListAlertClose}
                                sx={{ position: 'absolute', right: 15, top: 5, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}
                            >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17 }} />
                            </IconButton>
                        </Stack>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
                            <Scrollbar>
                                <TableContainer sx={{ overflow: '', mt: 2 }}>
                                    <Table sx={{ minWidth: 530 }} stickyHeader>
                                        <TableHeader sx={{ width: '100%' }}
                                            order={order}
                                            orderBy={orderBy}
                                            rowCount={GroupMemberList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            headLabel={[
                                                { id: 'Member Name', label: 'Member Name' },
                                                { id: 'Account No', label: 'Account No' },
                                                { id: 'Ticket No', label: 'Ticket No' },
                                            ]} />
                                        {GroupMemberListLoading
                                            ? <Stack mt={10} sx={{ alignItems: 'center' }}>
                                                <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                            </Stack>
                                            : <TableBody>
                                                {GroupMemberList
                                                    .map((row) => (
                                                        <TableRow hover tabIndex={-1} role="checkbox" selected={selected.indexOf(row.name) !== -1} onClick={(event) => handleClick(event, row)}>
                                                            <TableCell>{row.memberName}</TableCell>
                                                            <TableCell>{row.installfrom}</TableCell>
                                                            <TableCell>{row.tktno}</TableCell>
                                                        </TableRow>))}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(page, 5, GroupMemberList.length)} />
                                                {GroupMemberList.length === 0 && <TableNoData query={FilterName} />}
                                            </TableBody>}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        </Box>
                        {GroupMemberList.length > 0 && <TablePagination
                            page={page}
                            component="div"
                            count={TotalCount}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[15, 30, 50]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        />}
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
            <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "save_alert" ? 2000 : 1000} onClose={HandleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={HandleAlertClose}
                    severity={AlertFrom === "failed" || AlertFrom === "save_alert" ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }} >
                    {AlertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}