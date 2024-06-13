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
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Stack, Alert, Button, Dialog, Divider, Snackbar, Typography, IconButton, InputAdornment } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { MEMBER_VIEW, CHIT_AUCTION_SAVE, CHIT_AUCTION_LIST, REACT_APP_HOST_URL, CHIT_AUCTION_UPDATE, STANDING_INSTRUCTION } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './chitauction-add.css';
import { emptyRows } from '../member/utils';
import TableHeader from '../member/table-head';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';

export default function AddChitAuctionPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state;
    const Session = localStorage.getItem('apiToken');
    const [GroupNo, setGroupNo] = useState({
        data: data && data.groupno ? data.groupno : "",
        error: ""
    });
    const [Amount, setAmount] = useState({
        data: data && data.amount ? data.amount : "",
        error: ""
    });
    const [AucFromTime, setAucFromTime] = useState({
        data: null,
        data_save: "",
        error: ""
    });
    const [AucToTime, setAucToTime] = useState({
        data: null,
        data_save: "",
        error: ""
    });
    const [AucDate, setAucDate] = useState({
        data: null,
        data_save: "",
        error: ""
    });
    const [InstNo, setInstNo] = useState({
        data: "",
        error: ""
    });
    const [Dividend, setDividend] = useState({
        data: "0",
        error: ""
    });
    const [PrizedMember, setPrizedMember] = useState({
        data: "",
        error: ""
    });
    const [TktNo, setTktNo] = useState({
        data: "",
        error: ""
    });
    const [MaxADisc, setMaxADisc] = useState({
        data: "0",
        error: ""
    });
    const [FM_AFMCommission, setFM_AFMCommission] = useState({
        data: data && data.fm_afm ? data.fm_afm : "",
        error: ""
    });
    const [Loading, setLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    // const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));
    const [ChitAuctionList, setChitAuctionList] = useState([]);
    const [ChitAuctionLoading, setChitAuctionLoading] = useState(false);
    const [ChitAuctionMemberList, setChitAuctionMemberList] = useState([]);
    const [ChitAuctionMemberListLoading, setChitAuctionMemberListLoading] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [SelectAuctionList, setSelectAuctionMemberList] = useState({
        add: 0,
        add_data: '',
        remove: 0,
        remove_data: ''
    });
    const [ShowEstimateListAlert, setShowEstimateListAlert] = useState(false);
    const [AddMemberListAlert, setAddMemberListAlert] = useState(false);
    const [page, setPage] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [filterTicketNo, setfilterTicketNo] = useState('');
    const [ChitAuctionAddMemberList, setChitAuctionAddMemberList] = useState([]);
    const [ChitAuctionAddMemberListLoading, setChitAuctionAddMemberListLoading] = useState(false);
    const [ChitEstimateList, setChitEstimateList] = useState({});

    const existarray = [
        {
            "date": null,
            "id": 1,
            "branchid": 22,
            "groupid": 13,
            "groupno": "CA/GM/5/M/EEET",
            "amount": 100000.00,
            "auctiondate": "2024-03-26",
            "auction_time": "11:00 AM to 11:10 AM",
            "installno": 1,
            "installvalue": "100000",
            "fm_am_name": "Dhanabalan",
            "fmcode": "3",
            "dividend": 0.00,
            "prized_memid": 1,
            "prized_member_name": "MGM PUSHPAM CHITS PVT LTD.",
            "prized_group_member_id": 88,
            "tktno": "1",
            "maxaucdisc": 0.00,
            "prized_amount": 100000.00,
            "auction_no": 1,
            "foreman_commission": 0.00
        },
    ]
    
    useEffect(() => {
        console.log(data);
        const existingList = existarray;
        const existingInstno = new Set(existingList.map(item => item.installno));

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
            installno: instno,
            tktno: instno,
            auctiondate: null,
            branchid: 0,
            groupid: "0",
            groupno: "0",
            amount: "0",
            auction_time: "0",
            dividend: "0",
            installvalue: "0",
            fm_am_name: "",
            fmcode: "",
            prized_memid: "",
            prized_member_name: "",
            prized_group_member_id: "",
            maxaucdisc: "", 
            prized_amount: "",
            auction_no: "",
            foreman_commission: "",
        }));
        let completeList = [...existingList, ...additionalData];
        completeList.sort((a, b) => a.Instno - b.Instno);
        if (AuctionDateArray.length > 0) {
            const auctionDates = [
                AuctionDateArray[0].firstauctiondate,
                AuctionDateArray[0].secondauctiondate,
                AuctionDateArray[0].thirdauctiondate
            ];

            completeList = completeList.map((item, index) => {
                if (!item.auctiondate && index < auctionDates.length) {
                    return { ...item, auctiondate: auctionDates[index] };
                }
                return item;
            });

            const auctionMode = "monthly";
            const totalDatesNeeded = data.duration - auctionDates.length;
            const newAuctionDates = getNextAuctionDates(auctionDates, auctionMode, totalDatesNeeded);
            console.log(newAuctionDates);
            let newDateIndex = 0;
            completeList = completeList.map((item) => {
                if (!item.auctiondate && newDateIndex < newAuctionDates.length) {
                    const updatedItem = { ...item, auctiondate: newAuctionDates[newDateIndex] };
                    newDateIndex += 1;
                    console.log(updatedItem);
                    return updatedItem;
                }
                return item;
            });
        }
        setChitAuctionList(completeList);
        // GetChitAuctionEntryList();
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

    const AuctionDateArray = [
        {
            "id": 1,
            "groupId": data.id,
            "firstauctiondate": "2024-03-27",
            "secondauctiondate": "2024-04-27",
            "thirdauctiondate": "2024-05-27",
            "monthlyauctionday": "1",
            "weeklyauctionday": null,
            "bonuslesspercentage": 3.00,
            "maxlesspercentage": 3.00,
            "minlesspercentage": 1.00,
            "docCharge": 12.00,
            "serviceCharge": 0.00,
            "stationaryCharge": 0.00,
            "isActive": true,
            "fmcomPercentage": 2.00,
            "monthlyPart1AuctionDay": null,
            "monthlyPart2AuctionDay": null,
            "maxAmount": 90.00,
            "minAmount": 30.00,
            "minValue": 1.00,
            "comments": "",
            "groupno": data.groupno,
            "amount": data.amount,
            "isAuctionDone": 0,
            "duration": 3 }
    ]

    function getNextAuctionDates(auctionDates, auctionMode, totalDatesNeeded) {
        const lastAuctionDate = new Date(auctionDates[auctionDates.length - 1]);
        const newDates = [];
        if (auctionMode === "monthly") {
            for (let i = 1; i <= totalDatesNeeded; i += 1) {
                const nextDate = new Date(lastAuctionDate);
                nextDate.setMonth(nextDate.getMonth() + i);
                newDates.push(nextDate.toISOString().split('T')[0]);
            }
        } else if (auctionMode === "weekly") {
            for (let i = 1; i <= totalDatesNeeded; i += 1) {
                const nextDate = new Date(lastAuctionDate);
                nextDate.setDate(nextDate.getDate() + 7 * i);
                newDates.push(nextDate.toISOString().split('T')[0]);
            }
        } else if (auctionMode === "monthly_twice") {
            for (let i = 1; i <= totalDatesNeeded; i += 1) {
                const nextDate = new Date(lastAuctionDate);
                nextDate.setDate(nextDate.getDate() + 15 * i);
                newDates.push(nextDate.toISOString().split('T')[0]);
            }
        } else if (auctionMode === "monthly_thrice") {
            for (let i = 1; i <= totalDatesNeeded; i += 1) { 
                const nextDate = new Date(lastAuctionDate);
                nextDate.setDate(nextDate.getDate() + 10 * i);
                newDates.push(nextDate.toISOString().split('T')[0]);
            }
        }
        return newDates;
    }

    const GetChitAuctionEntryList = () => {
        setChitAuctionLoading(true);
        setChitAuctionList([]);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_LIST}${data.id}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionLoading(false);
                if (json.success) {
                    const existingList = existarray;
                    const existingInstno = new Set(existingList.map(item => item.installno));

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
                        installno: instno,
                        tktno: instno,
                        auctiondate: null,
                        branchid: 0,
                        groupid: "0",
                        groupno: "0",
                        amount: "0",
                        auction_time: "0",
                        dividend: "0",
                        installvalue: "0",
                        fm_am_name: "",
                        fmcode: "",
                        prized_memid: "",
                        prized_member_name: "",
                        prized_group_member_id: "",
                        maxaucdisc: "",
                        prized_amount: "",
                        auction_no: "",
                        foreman_commission: ""
                    }));
                    let completeList = [...existingList, ...additionalData];
                    completeList.sort((a, b) => a.Instno - b.Instno);
                    if (AuctionDateArray.length > 0) {
                        const auctionDates = [
                            AuctionDateArray[0].firstauctiondate,
                            AuctionDateArray[0].secondauctiondate,
                            AuctionDateArray[0].thirdauctiondate
                        ];

                        completeList = completeList.map((item, index) => {
                            if (!item.auctiondate && index < auctionDates.length) {
                                return { ...item, auctiondate: auctionDates[index] };
                            }
                            return item;
                        });

                        const auctionMode = "monthly";
                        const totalDatesNeeded = data.duration - auctionDates.length;
                        const newAuctionDates = getNextAuctionDates(auctionDates, auctionMode, totalDatesNeeded);
                        console.log(newAuctionDates);
                        let newDateIndex = 0;
                        completeList = completeList.map((item) => {
                            if (!item.auctiondate && newDateIndex < newAuctionDates.length) {
                                const updatedItem = { ...item, auctiondate: newAuctionDates[newDateIndex] };
                                newDateIndex += 1;
                                console.log(updatedItem);
                                return updatedItem;
                            }
                            return item;
                        });
                    }
                    setChitAuctionList(completeList);
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
                setChitAuctionLoading(false);
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

    const GetMemberView = (id, datas) => {
        const url = `${REACT_APP_HOST_URL}${MEMBER_VIEW}${id}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    if (datas.length > 0) {
                        const updatedFirstItem = {
                            ...datas[0],
                            prized_memid: json.list.id,
                            prized_member_name: json.list.name,
                            prized_group_member_id: json.list.accno,
                        };
                        const updatedList = [updatedFirstItem];
                        // console.log('Updated list after updating first item:', updatedList);
                        setSelectAuctionMemberList({
                            add: 0,
                            add_data: updatedFirstItem,
                            remove: 0,
                            remove_data: '',
                            member_edit: 'true'
                        });
                        setChitAuctionMemberList(updatedList);
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
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitAuctionAddMethod = (IsValidate) => {
        if (IsValidate){
            setLoading(true);
            const ChitAuctionListParams = {
                "id": 0,
                "group_id": ChitAuctionList[SelectAuctionList.add].group_id,
                "install_no": ChitAuctionList[SelectAuctionList.add].install_no,
                "ticket_no": ChitAuctionList[SelectAuctionList.add].ticket_no,
                "member_id": ChitAuctionList[SelectAuctionList.add].member_id,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "is_active": ChitAuctionList[SelectAuctionList.add].is_active,
                "comments": ChitAuctionList[SelectAuctionList.add].comments
            };
            const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_SAVE}`;
            console.log(JSON.stringify(ChitAuctionListParams) + url);
            console.log(Session);
            fetch(url, PostHeader(JSON.parse(Session), ChitAuctionListParams))
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

    const ChitAuctionUpdateMethod = (IsValidate, id) => {
        if(IsValidate){
            setLoading(true);
            const ChitAuctionListUpdateParams = {
                "id": 0,
                "group_id": ChitAuctionList[SelectAuctionList.add].group_id,
                "install_no": ChitAuctionList[SelectAuctionList.add].install_no,
                "ticket_no": ChitAuctionList[SelectAuctionList.add].ticket_no,
                "member_id": ChitAuctionList[SelectAuctionList.add].member_id,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "is_active": ChitAuctionList[SelectAuctionList.add].is_active,
                "comments": ChitAuctionList[SelectAuctionList.add].comments
            };
            const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_UPDATE}${id}`;
            console.log(JSON.stringify(ChitAuctionListUpdateParams) + url);
            console.log(Session);
            fetch(url, PutHeader(JSON.parse(Session), ChitAuctionListUpdateParams))
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

    const ChitAuctionTextValidate = (e, from) => {
        const text = e.target.value;
        setScreenRefresh(pre => pre + 1);
        console.log(from);
        if (from === "GroupNo") {
            setGroupNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Amount") {
            setAmount(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AucFromTime") {
            setAucFromTime(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "AucToTime") {
            setAucToTime(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "" : ""
            }));
        } else if (from === "AucDate") {
            setAucDate(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "InstNo") {
            setInstNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "Dividend") {
            setDividend(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "PrizedMember") {
            setPrizedMember(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "TktNo") {
            setTktNo(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "MaxADisc") {
            setMaxADisc(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        } else if (from === "FM_AFMCommission") {
            setFM_AFMCommission(prevState => ({
                ...prevState,
                data: text.trim() !== "" ? text : "",
                error: text.trim() === "" ? "* Required" : ""
            }));
        }
    };

    const validateChitAuctionInfo = () => {
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
        if (!AucFromTime.data) {
            IsValidate = false;
            setAucFromTime(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAucFromTime(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AucToTime.data) {
            IsValidate = false;
            setAucToTime(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAucToTime(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!AucDate.data) {
            IsValidate = false;
            setAucDate(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setAucDate(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!InstNo.data) {
            IsValidate = false;
            setInstNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setInstNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!Dividend.data) {
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
        }
        if (!PrizedMember.data) {
            IsValidate = false;
            setPrizedMember(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setPrizedMember(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!TktNo.data) {
            IsValidate = false;
            setTktNo(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setTktNo(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!MaxADisc.data) {
            IsValidate = false;
            setMaxADisc(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setMaxADisc(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (!FM_AFMCommission.data) {
            IsValidate = false;
            setFM_AFMCommission(prevState => ({
                ...prevState,
                error: "* Required"
            }));
        } else {
            setFM_AFMCommission(prevState => ({
                ...prevState,
                error: ""
            }));
        }
        if (ChitAuctionList.length > 0){
            console.log(SelectAuctionList)
            if (typeof SelectAuctionList.add_data.id === 'string' && SelectAuctionList.add_data.id.includes('id_')){
                ChitAuctionAddMethod(IsValidate);
            }else{
                ChitAuctionUpdateMethod(IsValidate, SelectAuctionList.add_data.id);
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
            // navigate('/chitauction/list');
        }
    }

    const HandleSubmitClick = () => {
        console.log("submitclick11");
        validateChitAuctionInfo();
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
            const newSelecteds = ChitAuctionList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const HandleDateChange = (date) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "";
        // console.log('Date to save:', DateForSave);
        setAucDate({
            data: date,
            data_save: DateForSave,
            error: ""
        });
    };

    const HandleTimeChange = (time, from) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = time.format('h:mm A');
        console.log('Time to save:', DateForSave, ' ', time);
        if (from === "AucFromTime") {
            setAucFromTime({
                data: time,
                data_save: DateForSave,
                error: ""
            });
        } else if (from === "AucToTime") {
            setAucToTime({
                data: time,
                data_save: DateForSave,
                error: ""
            });
        }
    };

    const HandleShowEstimateClick = () => {
        setShowEstimateListAlert(true);
    };

    const HandleAddMemberClick = () => {
        setAddMemberListAlert(true);
    };

    const HandleResetClick = () => {
        // setAddMemberListAlert(true);
    };

    const HandleDeleteClick = () => {
        // setAddMemberListAlert(true);
    };

    const handleClick = (event, item, from) => {
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
        setSelectAuctionMemberList(item);
        console.log(item);
        if (from === "company_member"){
            GetStandingInstructionList(ChitAuctionList);
        }else{
            setAddMemberListAlert(false);
        }
    };

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const HandleFilterTicketNo = (event) => {
        setPage(0);
        setfilterTicketNo(event.target.value);
    };

    const HandleMemberListAlertClose = () => {
        setAddMemberListAlert(false);
    };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                navigate('/chitauction/list');
            }
        } else {
            navigate('/chitauction/list');
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    Chit Auction
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
                    {ChitAuctionLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Group No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Group No"
                                                value={GroupNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "GroupNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Amount
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Amount"
                                                value={Amount.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Amount")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Auc From Time
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['MobileTimePicker',]} sx={{ width: 550 }}>
                                                    <MobileTimePicker
                                                        className='input-box1'
                                                        label="Auc From Time"
                                                        disabled={screen === "view"}
                                                        defaultValue={dayjs()}
                                                        value={AucFromTime.data}
                                                        onChange={(date) => HandleTimeChange(date, "AucFromTime")} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AucFromTime.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Auc To Time
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['MobileTimePicker',]} sx={{ width: 550 }}>
                                                    <MobileTimePicker
                                                        className='input-box1'
                                                        label="Auc To Time"
                                                        disabled={screen === "view"}
                                                        defaultValue={dayjs()}
                                                        value={AucToTime.data}
                                                        onChange={(date) => HandleTimeChange(date, "AucToTime")} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AucToTime.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Auc Date
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']} sx={{ width: 550 }}>
                                                    <DatePicker
                                                        className='input-box1'
                                                        label="Auc Date"
                                                        disabled={screen === "view"}
                                                        value={AucDate.data}
                                                        onChange={HandleDateChange}
                                                        format="DD-MM-YYYY" />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{AucDate.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Inst No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Inst No"
                                                value={InstNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "InstNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{InstNo.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Dividend
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Dividend"
                                                value={Dividend.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Dividend")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", }}>{Dividend.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Prized Member
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Prized Member"
                                                value={PrizedMember.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "PrizedMember")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{PrizedMember.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Tkt.No
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Tkt.No"
                                                value={TktNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "TktNo")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{TktNo.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={2} alignItems='center' className='stack-box'>
                                <div className='box-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Max.A.Disc
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="Max.A.Disc"
                                                value={MaxADisc.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "MaxADisc")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{MaxADisc.error}</div>
                                    </Stack>
                                </div>
                                <div className='box-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            F.M/A.F.M Commission
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                // required
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                label="F.M/A.F.M Commission"
                                                value={FM_AFMCommission.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "FM_AFMCommission")}
                                                style={{}} />
                                        </Stack>
                                        <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{FM_AFMCommission.error}</div>
                                    </Stack>
                                </div>
                            </Stack>
                            <Scrollbar>
                                <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
                                    <Table sx={{ minWidth: 800 }}>
                                        <TableHeader
                                            order="asc"
                                            orderBy="name"
                                            rowCount={ChitAuctionList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            headLabel={[
                                                { id: 'Inst.No', label: 'Inst.No' },
                                                { id: 'Auc.Date', label: 'Auc.Date' },
                                                { id: 'Prized Member', label: 'Prized Member' },
                                            ]} />
                                        <TableBody>
                                            {ChitAuctionList
                                                .map((row, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }} onClick={row.installno === 1 ? (event) => handleClick(event, row, "company_member") : null}>
                                                        <TableCell>{row.installno}</TableCell>
                                                        <TableCell>{row.auctiondate ? dayjs(row.auctiondate).format('DD-MM-YYYY') : null}</TableCell>
                                                        <TableCell>{row.prized_member_name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(0, 15, ChitAuctionList.length)}
                                            />
                                            {ChitAuctionList.length === 0 && <TableNoData query="" />}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                            <Scrollbar>
                                {ChitAuctionMemberListLoading
                                    ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                    </Stack>
                                    : <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
                                        <Table sx={{ minWidth: 800 }}>
                                            <TableHeader
                                                order="asc"
                                                orderBy="name"
                                                rowCount={ChitAuctionMemberList.length}
                                                numSelected={selected.length}
                                                onRequestSort={handleSort}
                                                onSelectAllClick={handleSelectAllClick}
                                                headLabel={[
                                                    { id: 'Tkt.No', label: 'Tkt.No' },
                                                    { id: 'Member Name', label: 'Member Name' },
                                                    { id: 'Max.Auc.Disc', label: 'Max.Auc.Disc' },
                                                    { id: 'Sign', label: 'Sign' },
                                                    { id: 'Action', label: 'Action' },
                                                ]} />
                                            <TableBody>
                                                {ChitAuctionMemberList
                                                    .map((row, index) => (
                                                        <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }}>
                                                            <TableCell>{row.tktno}</TableCell>
                                                            <TableCell>{row.prized_member_name}</TableCell>
                                                            <TableCell>{row.maxaucdisc}</TableCell>
                                                            <TableCell>{row.tktno}</TableCell>
                                                            <TableCell> {row.action === "add" ? ("Add") : ("Delete")}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(0, 15, ChitAuctionMemberList.length)}
                                                />
                                                {ChitAuctionMemberList.length === 0 && <TableNoData query="" />}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>}
                            </Scrollbar>
                            <Stack direction='row' alignItems='flex-end'>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>

                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleResetClick}>
                                    Reset
                                </Button>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleAddMemberClick}>
                                    Add Member
                                </Button>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 200, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleShowEstimateClick}>
                                    Show Estimate
                                </Button>
                                <Button sx={{ mr: 5, mt: 2, mb: 3, height: 50, width: 150, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleDeleteClick}>
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>}
                </Box>
            </Card>
            <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "save_alert" ? 2000 : 1000} onClose={HandleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={HandleAlertClose}
                    severity={AlertFrom === "failed" || AlertFrom === "save_alert" ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }} >
                    {AlertMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={ShowEstimateListAlert}
                fullWidth={600}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>
                    <Stack>
                        <Stack mt={2} ml={2} mr={1} direction="row" alignItems="center" >
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                   { `Group No - ${GroupNo.data}`}
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={() => setShowEstimateListAlert(false)}
                                sx={{ position: 'absolute', right: 2, top: 0, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 3, }}/>
                        <Scrollbar>
                            <Stack direction='column' sx={{ m: 4 }}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <div className='box-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Chit Amount
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Chit Amount"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                        </Stack>
                                    </div>
                                    <div className='box-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Ticket No
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Ticket No"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='box-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Installment No
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Installment No"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                        </Stack>
                                    </div>
                                    <div className='box-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Member Name
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Member Name"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='box-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" >
                                                Auction Date
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Auction Date"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                        </Stack>
                                    </div>
                                    <div className='box-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Less Amount
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Less Amount"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='box-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Payment Amount
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Payment Amount"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                        </Stack>
                                    </div>
                                    <div className='box-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Particulars
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Particulars"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{Amount.error}</div>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='box-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Due Amount
                                            </Typography>
                                            <Stack direction='row' sx={{ mt: 2 }}>
                                                <TextField
                                                    className='input-box2'
                                                    id="outlined-required"
                                                    disabled
                                                    label="Due Amount"
                                                    value={Amount.data}
                                                    style={{}} />
                                            </Stack>
                                            <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "12px", fontWeight: "500", width: "100px" }}>{GroupNo.error}</div>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Stack>
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={AddMemberListAlert}
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
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                            </IconButton>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{ overflow: '', mt: 2 }}>
                                <Table sx={{ minWidth: 530 }} stickyHeader>
                                    <TableHeader sx={{ width: '100%' }}
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={ChitAuctionAddMemberList.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleSort}
                                        onSelectAllClick={handleSelectAllClick}
                                        headLabel={[
                                            { id: 'Member Name', label: 'Member Name' },
                                            { id: 'Account No', label: 'Account No' },
                                            { id: 'Tkt No', label: 'Tkt No' },
                                        ]} />
                                    {ChitAuctionAddMemberListLoading
                                        ? <Stack mt={10} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                        </Stack>
                                        : <TableBody>
                                            {ChitAuctionAddMemberList
                                                .map((row) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" selected={selected.indexOf(row.name) !== -1} onClick={(event) => handleClick(event, row, "")} sx={{ cursor: 'pointer' }}>
                                                        <TableCell>{row.groupno}</TableCell>
                                                        <TableCell>{row.tktNo}</TableCell>
                                                        <TableCell>{row.name}</TableCell>
                                                    </TableRow>))}
                                            <TableEmptyRows
                                                height={77}
                                                emptyRows={emptyRows(page, 5, ChitAuctionAddMemberList.length)} />
                                            {ChitAuctionAddMemberList.length === 0 && <TableNoData query={filterName} />}
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