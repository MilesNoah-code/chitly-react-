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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Grid, Stack, Alert, Button, Dialog, styled, Portal, Divider, Snackbar, Typography, IconButton, InputAdornment, TablePagination } from '@mui/material';

import { GetHeader, PutHeader, PostHeader, DeleteHeader, } from 'src/hooks/AxiosApiFetch';

import { CHIT_AUCTION_SAVE, CHIT_AUCTION_LIST, CHIT_PAYMENT_LIST, CHIT_RECEIPT_LIST, GROUP_MEMBER_LIST, REACT_APP_HOST_URL, CHIT_AUCTION_UPDATE, STANDING_INSTRUCTION, 
    CHIT_AUCTION_MEMBER_LIST, CHIT_AUCTION_ENTRY_DELETE, CHIT_PAYMENT_CHIT_PARAMETERS, ESTIMATE_LIST_BASED_INSTALL_TKT, CHIT_AUCTION_MAPPED_UNMAPPED_MEMBER, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';
import ScreenError from 'src/Error/ScreenError';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './chitauction-add.css';
import { emptyRows } from '../member/utils';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';

export default function AddChitAuctionPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state || {};
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
    const [ChitAuctionLoading, setChitAuctionLoading] = useState(true);
    const [ChitAuctionMemberList, setChitAuctionMemberList] = useState([]);
    const [ChitAuctionMemberListLoading, setChitAuctionMemberListLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [SelectAuctionList, setSelectAuctionList] = useState({});
    const [ShowEstimateListAlert, setShowEstimateListAlert] = useState(false);
    const [AddMemberListAlert, setAddMemberListAlert] = useState(false);
    const [page, setPage] = useState(0);
    const [filterName, setFilterName] = useState('');
    const [filterTicketNo, setfilterTicketNo] = useState('');
    const [ChitAuctionAddMemberList, setChitAuctionAddMemberList] = useState([]);
    const [ChitAuctionAddMemberListLoading, setChitAuctionAddMemberListLoading] = useState(false);
    const [ChitEstimateList, setChitEstimateList] = useState({});
    const [ChitAuctionListTotal, setChitAuctionListTotal] = useState(0);
    const [ChitPaymentListTotal, setChitPaymentListTotal] = useState(0);
    const [ChitReceiptListTotal, setChitReceiptListTotal] = useState(0);
    const [DeleteAlert, setDeleteAlert] = useState(false);
    const [DeleteLoading, setDeleteLoading] = useState(false);
    const [ChitAuctionSelectedIndex, setChitAuctionSelectedIndex] = useState(0);
    const [SelectedId, setSelectedId] = useState(0);
    const [ChitParameter, setChitParameter] = useState([]);
    // const [GroupMemberList, setGroupMemberList] = useState([]);
    const [CompanyMemberId, setCompanyMemberId] = useState(0);
    const [SelectedDateId, setSelectedDateId] = useState(0);
    const [isEditable, setEditable] = useState(true);
    const [TotalCount, setTotalCount] = useState(0);
    const [dialogPage, setDialogPage] = useState(0);
    const [dialogRowsPerPage, setDialogRowsPerPage] = useState(10);


    useEffect(() => {
        console.log(data);
        setChitAuctionAddMemberList([]);
        setChitAuctionAddMemberListLoading(false);
        GetChitAuctionEntryList();
        GetChitParameter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    useEffect(() => {
        GetChitAuctionAddMemberList(filterTicketNo, filterName,dialogPage * dialogRowsPerPage, dialogRowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterTicketNo, filterName,dialogPage, dialogRowsPerPage]);


    /* const AuctionDateArray = [
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
    } */

    const GetChitAuctionEntryList = () => {
        setChitAuctionLoading(true);
        setChitAuctionList([]);
        setChitAuctionListTotal(0);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_LIST}${data?.id ? data.id : ""}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionLoading(false);
                if (json.success) {
                    setChitAuctionListTotal(json.total);
                    const existingList = json.list;
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
                        id: "0",
                        primary_id: `id_${instno}`,
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
                        maxaucdisc: "0",
                        prized_amount: "",
                        auction_no: "",
                        foreman_commission: "",
                    }));
                    const completeList = [...existingList, ...additionalData];
                    completeList.sort((a, b) => a.Instno - b.Instno);
                    // three auction date is given from the api after that calculate pending auction date
                    // based on the auction mode for that use the above function (getNextAuctionDates)
                    /* if (AuctionDateArray.length > 0) {
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
                    } */
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

    const GetStandingInstructionList = (datas, from) => {
        const url = `${REACT_APP_HOST_URL}${STANDING_INSTRUCTION}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    if (from === "2") {
                        if (datas.prized_memid === json.list.id) {
                            setCompanyMemberId(json.list.id);
                            setEditable(false);
                        } else {
                            setCompanyMemberId(0);
                            console.log("setEditable");
                        }
                    } else {
                        GetGroupMemberList(json.list.id, datas);
                    }
                } else if (json.success === false) {
                    setChitAuctionMemberListLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setChitAuctionMemberListLoading(false);
                    setErrorAlert(true);
                    setErrorScreen("network");
                }
            })
            .catch((error) => {
                setChitAuctionMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetGroupMemberList = (companyMemberId, datas) => {
        // setGroupMemberList([]);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}&groupId=${data.id}&start=0&limit=0`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionMemberListLoading(false);
                if (json.success) {
                    // setGroupMemberList(json.list);
                    console.log("datas.installno ", datas.installno);
                    console.log("data.fmprdue", data.fmprdue);
                    if (datas.installno === Number(data.fmprdue)) {
                        if (json.list.length > 0) {
                            setCompanyMemberId(companyMemberId);
                            const CompanyMemberDetailList = json.list.filter(item => item.memberId === companyMemberId);
                            console.log("CompanyMemberDetailList", CompanyMemberDetailList[0]);
                            const updatedFirstItem = {
                                ...datas,
                                memberid: CompanyMemberDetailList[0].memberId,
                                member_name: CompanyMemberDetailList[0].memberName,
                                group_member_id: CompanyMemberDetailList[0].id,
                                maxaucdisc: "0",
                                signature: "",
                                prized_amount: data.amount,
                                is_prizedmember: "1",
                                action: 'delete',
                                is_companymember: "companymember"
                            };
                            const updatedList = [updatedFirstItem];
                            console.log("updatedList", updatedList)
                            setInstNo({
                                data: updatedFirstItem.installno,
                                error: ""
                            });
                            setDividend({
                                data: updatedFirstItem.dividend,
                                error: ""
                            });
                            setPrizedMember({
                                data: updatedFirstItem.member_name,
                                error: ""
                            });
                            setTktNo({
                                data: updatedFirstItem.installno,
                                error: ""
                            });
                            setMaxADisc({
                                data: updatedFirstItem.maxaucdisc,
                                error: ""
                            });
                            setSelectAuctionList(updatedFirstItem);
                            setChitAuctionMemberList(updatedList);
                        }
                    } else {
                        setCompanyMemberId(0);
                        setChitAuctionMemberList([]);
                        setAucFromTime({
                            data: null,
                            data_save: "",
                            error: ""
                        });
                        setAucToTime({
                            data: null,
                            data_save: "",
                            error: ""
                        });
                        setAucDate({
                            data: null,
                            data_save: "",
                            error: ""
                        });
                        HandleResetClick();
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
                setChitAuctionMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetChitEstimateList = (install_no) => {
        const url = `${REACT_APP_HOST_URL}${ESTIMATE_LIST_BASED_INSTALL_TKT}groupId=${data.id}&installNo=${install_no}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    setFM_AFMCommission({
                        data: json.list.fm_commission,
                        error: ""
                    });
                    setChitEstimateList(json.list);
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
    };

    const GetChitPaymentList = (installno) => {
        setChitPaymentListTotal(0);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_LIST}1&groupId=${data.id}&installmentNo=${installno}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    setChitPaymentListTotal(json.total);
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
    };

    const GetChitReceiptList = (installno) => {
        setChitReceiptListTotal(0);
        const url = `${REACT_APP_HOST_URL}${CHIT_RECEIPT_LIST}&groupId=${data.id}&installNo=${installno}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    setChitReceiptListTotal(json.total);
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

    const GetChitParameter = () => {
        setChitParameter([]);
        const url = `${REACT_APP_HOST_URL}${CHIT_PAYMENT_CHIT_PARAMETERS}${data?.id ? data.id : ""}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                if (json.success) {
                    if (json.list.length > 0) {
                        setChitParameter(json.list);
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

    const GetChitAuctionMemberList = (auctionEntryId, items) => {
        setChitAuctionMemberListLoading(true);
        setChitAuctionMemberList([]);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_MEMBER_LIST}${auctionEntryId}&start=0&limit=0`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionMemberListLoading(false);
                if (json.success) {
                    setChitAuctionMemberList(json.list);
                        if (json.list.length > 0) {
                        let filteredList;
                        if (json.list.length === 1 && json.list[0].maxaucdisc === "0.00") {
                            filteredList = json.list;
                            console.log("filteredList")
                            console.log(filteredList)
                        } else {
                            const MaxAucDisc = Math.max(...json.list.map(item => item.maxaucdisc));
                            console.log(MaxAucDisc)
                            filteredList = json.list.filter(item => Number(item.maxaucdisc) === MaxAucDisc);
                            console.log(filteredList);
                        }
                        const filteredObject = filteredList.length > 0 ? filteredList[0] : items;
                        setSelectAuctionList(filteredObject);
                        if (filteredList.length > 0) {
                            setInstNo({
                                data: filteredList[0].installno,
                                error: ""
                            });
                            setPrizedMember({
                                data: filteredList[0].member_name,
                                error: ""
                            });
                            setTktNo({
                                data: filteredList[0].tktno,
                                error: ""
                            });
                            setMaxADisc({
                                data: filteredList[0].maxaucdisc,
                                error: ""
                            });
                            setAucDate({
                                data: filteredList[0].auctiondate !== null && filteredList[0].auctiondate !== "" ? dayjs(filteredList[0].auctiondate) : "",
                                data_save: filteredList[0].auctiondate !== null && filteredList[0].auctiondate !== "" ? dayjs(filteredList[0].auctiondate).format('YYYY-MM-DD') : "",
                                error: ""
                            });
                        }
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
                setChitAuctionMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GetChitAuctionAddMemberList = (tktno, membername ,start,limit) => {
        setChitAuctionAddMemberListLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_MAPPED_UNMAPPED_MEMBER}${data?.id ? data.id : ""}&tokenNo=${tktno}&memberName=${membername}&start=${start}&limit=${limit}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setChitAuctionAddMemberListLoading(false);
                if (json.success) {
                    setChitAuctionAddMemberList(json.list);
                    setTotalCount(json.total)
                    console.log('total:',json.total)
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
                setChitAuctionAddMemberListLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const ChitAuctionAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            console.log(SelectAuctionList)
            const ChitAuctionMemberListParams = ChitAuctionMemberList.map(item => {
                const tktno = item.tktno !== null && item.tktno !== "" ? item.tktno : '';
                const result = Number.isInteger(parseInt(tktno, 10)) ? parseInt(tktno, 10) : String(tktno);
                return {
                    "id": 0,
                    "auctionentryid": 0,
                    "tktno": result,
                    "tkt_suffix": "A",
                    "tkt_percentage": "100",
                    "memberid": item.memberid,
                    "member_name": item.member_name,
                    "group_member_id": item.group_member_id,
                    "maxaucdisc": item.maxaucdisc,
                    "signature": item.signature,
                    "is_prizedmember": item.is_prizedmember,
                    "entNo": 0,
                    "branchid": data.branchid,
                    "comments": "",
                    "is_active": 1,
                };
            });
            const ChitAuctionListParams = {
                "id": SelectAuctionList.id,
                "branchid": 0,
                "groupid": data.id,
                "amount": data.amount,
                "agreement_no": null,
                "agreement_date": null,
                "auctiondate": AucDate.data_save,
                "date": AucDate.data_save,
                "auction_time": `${AucFromTime.data_save} to ${AucToTime.data_save}`,
                "holreason": "",
                "installno": SelectAuctionList.installno,
                "installvalue": "",
                "ledger_id": "",
                "foreman_commission": data.fm_afm !== null && data.fm_afm !== "" ? data.fm_afm : "0",
                "fmcode": "",
                "dividend": SelectAuctionList.dividend,
                "filingdate": null,
                "prized_memid": SelectAuctionList.memberid,
                "prized_member_name": SelectAuctionList.member_name,
                "prized_group_member_id": SelectAuctionList.group_member_id,
                "tktno": SelectAuctionList.tktno,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "maxaucdisc": SelectAuctionList.maxaucdisc !== "" && SelectAuctionList.maxaucdisc != null ?
                    SelectAuctionList.maxaucdisc : "", // if empty pass 0
                "prized_amount": SelectAuctionList.prized_amount,
                "doc_charge": "0",
                "doc_charge_w_t": "0",
                "estimate_id": ChitEstimateList ? ChitEstimateList.id : "0",
                "comments": "",
                "is_active": 1,
                "min_auc_value": "0",
                "max_auc_value": "0",
                "auctionMemberDetails": ChitAuctionMemberListParams,

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
                    setCompanyMemberId(0);
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
        if (IsValidate) {
            setLoading(true);
            const ChitAuctionMemberListUpdateParams = ChitAuctionMemberList.map(item => ({
                "id": 0,
                "auctionentryid": 0,
                "tktno": item.tktno,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "memberid": item.memberid,
                "member_name": item.member_name,
                "group_member_id": item.group_member_id,
                "maxaucdisc": item.maxaucdisc,
                "signature": item.signature,
                "is_prizedmember": item.is_prizedmember,
                "entNo": 0,
                "branchid": data.branchid,
                "comments": "",
                "is_active": 1,
            }));
            const ChitAuctionListUpdateParams = {
                "id": SelectAuctionList.id,
                "branchid": 0,
                "groupid": data.id,
                "amount": data.amount,
                "agreement_no": null,
                "agreement_date": null,
                "auctiondate": AucDate.data_save,
                "date": AucDate.data_save,
                "auction_time": `${AucFromTime.data_save ? dayjs(AucFromTime.data_save, 'hh:mm A').format('hh:mm A') : AucFromTime.data_save} to ${AucToTime.data_save ? dayjs(AucToTime.data_save, 'hh:mm A').format('hh:mm A') : AucToTime.data_save}`,
                "holreason": "",
                "installno": SelectAuctionList.installno,
                "installvalue": "",
                "ledger_id": "",
                "foreman_commission": data.fm_afm !== null && data.fm_afm !== "" ? data.fm_afm : "0",
                "fmcode": "",
                "dividend": SelectAuctionList.dividend,
                "filingdate": null,
                "prized_memid": SelectAuctionList.memberid,
                "prized_member_name": SelectAuctionList.member_name,
                "prized_group_member_id": SelectAuctionList.group_member_id,
                "tktno": SelectAuctionList.tktno,
                "tkt_suffix": "A",
                "tkt_percentage": "100",
                "maxaucdisc": SelectAuctionList.maxaucdisc !== "" && SelectAuctionList.maxaucdisc != null ?
                    SelectAuctionList.maxaucdisc : "", // if empty pass 0
                "prized_amount": SelectAuctionList.prized_amount,
                "doc_charge": "0",
                "doc_charge_w_t": "0",
                "estimate_id": ChitEstimateList ? ChitEstimateList.id : "0",
                "comments": "",
                "is_active": 1,
                "min_auc_value": "0",
                "max_auc_value": "0",
                "auctionMemberDetails": ChitAuctionMemberListUpdateParams,
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
                    setCompanyMemberId(0);
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
    };

    const ChitAuctionEntryDeleteMethod = (id) => {
        setDeleteLoading(true);
        const url = `${REACT_APP_HOST_URL}${CHIT_AUCTION_ENTRY_DELETE}${id}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, DeleteHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setDeleteLoading(false);
                setScreenRefresh(0);
                setCompanyMemberId(0);
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
                setDeleteLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
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
                error: text.trim() === "" ? "" : ""
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
        /* if (!FM_AFMCommission.data) {
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
        } */
        if (ChitAuctionList.length > 0) {
            console.log(SelectAuctionList)
            if (typeof SelectedId === 'string' && SelectedId.includes('id_')) {
                ChitAuctionAddMethod(IsValidate);
            } else {
                ChitAuctionUpdateMethod(IsValidate, SelectedId);
            }
        }
    };

    const ChitAuctionMemberListTextValidate = (e, item, from) => {
        const text = e.target.value;
        // console.log(from);
        setChitAuctionMemberList(prevState => {
            const updatedList = prevState.map((prev, index) => {
                // const isEditable = String(item.id).includes('id_') || (index === prevState.length - 1 && !String(item.id).includes('id_'));
                
                // if(prev.id !==0 && prev.id !=="0")
                //     {
                //         if( ChitParameter.length > 0)
                //         {
                //             setEditable(true);
                //         } 
                //     }            
                if (prev === item && (isEditable || item.id === "0" || item.id === 0)) {
                    if (from === "maxaucdisc") {
                        return {
                            ...prev,
                            maxaucdisc: text.trim() !== "" ? text : "",
                        };
                    }
                    if (from === "signature") {
                        console.log(text);
                        return {
                            ...prev,
                            signature: text.trim() !== "" ? text : "",
                        };
                    }
                }
                return prev;
            });

            // Find the item with the highest maxaucdisc value
            console.log(updatedList)
            if (updatedList.length > 0) {
                let highestItem;
                if (updatedList.length === 1) {
                    highestItem = updatedList[0];
                } else {
                    highestItem = updatedList.reduce((maxItem, currItem) => {
                        const currMaxAucDisc = parseFloat(currItem.maxaucdisc) || 0;
                        return currMaxAucDisc > (parseFloat(maxItem.maxaucdisc) || 0) ? currItem : maxItem;
                    }, { maxaucdisc: "0" });
                }
                const fmAfmCommission = Number(FM_AFMCommission) || 0;
                const CalculateDividend = (Number(highestItem.maxaucdisc) - fmAfmCommission) / data.duration || 0;
                console.log("CalculateDividend--> ", CalculateDividend);
                setDividend({
                    data: CalculateDividend.toFixed(2) || 0,
                    error: ""
                });
                setInstNo({
                    data: highestItem.installno,
                    error: ""
                });
                /* setDividend({
                    data: highestItem.dividend ? highestItem.dividend : "0",
                    error: ""
                }); */
                setPrizedMember({
                    data: highestItem.member_name,
                    error: ""
                });
                setTktNo({
                    data: highestItem.tktno,
                    error: ""
                });
                setMaxADisc({
                    data: highestItem.maxaucdisc,
                    error: ""
                });

                // Update the prized_member value of the highestItem
                const finalList = updatedList.map(items =>
                    items === highestItem ? { ...items, is_prizedmember: "1" } : { ...items, is_prizedmember: "0" }
                );

                return finalList;
            }

            return updatedList;
        });

    };

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

    const HandleDateChange = (date, from, item) => {
        setScreenRefresh(pre => pre + 1);
        const DateForSave = date ? dayjs(date).format('YYYY-MM-DD') : "";
        console.log('Date to save:', DateForSave);
        if (from === "auctiondate") {
            setSelectedDateId(item.id);
            setChitAuctionList(prevState =>
                prevState.map(prev => {
                    if (prev === item) {
                        return {
                            ...prev,
                            maxaucdisc: date,
                        };
                    }
                    return prev;
                })
            );
            console.log('Date to save:11', DateForSave);
            setAucDate({
                data: date,
                data_save: DateForSave,
                error: ""
            });
        } else {
            console.log('SelectedDateId', SelectedDateId);
            /* setChitAuctionList(prevState =>
                prevState.map(items => {
                    if (items.id === SelectedDateId) {
                        return {
                            ...items,
                            maxaucdisc: date,
                        };
                    }
                    return items;
                })
            ); */
            setAucDate({
                data: date,
                data_save: DateForSave,
                error: ""
            });
        }
    };

    const HandleOnAcceptTimeChange = (from) => {
        setScreenRefresh(prev => prev + 1);
        const isValidTimeRange = (fromTime, toTime) => fromTime.isBefore(toTime);
        if (from === "Accept_AucFromTime") {
            console.log('AucToTime.data1 ', AucToTime.data, ' AucFromTime.data ', AucFromTime.data, "isValidTimeRange1 ", isValidTimeRange(AucFromTime.data, AucToTime.data));
            if (AucToTime.data && !isValidTimeRange(AucFromTime.data, AucToTime.data)) {
                setAlertMessage("From time must be earlier than To time");
                setAlertFrom("failed");
                HandleAlertShow();
                setAucFromTime({
                    data: null,
                    data_save: "",
                    error: ""
                });
            } else {
                setAucFromTime(prevState => ({
                    ...prevState,
                }));
            }
        } else if (from === "Accept_AucToTime") {
            console.log('AucFromTime.data2', AucFromTime.data, ' AucToTime.data ', AucToTime.data, "isValidTimeRange2 ", isValidTimeRange(AucToTime.data, AucFromTime.data));
            if (AucFromTime.data && !isValidTimeRange(AucFromTime.data, AucToTime.data)) {
                setAlertMessage("From time must be earlier than To time");
                setAlertFrom("failed");
                HandleAlertShow();
                setAucToTime({
                    data: null,
                    data_save: "",
                    error: ""
                });
            } else {
                setAucToTime(prevState => ({
                    ...prevState,
                }));
            }
        }
    };

    const HandleTimeChange = (time, from) => {
        if (time) {
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
        } else {
            console.log('Time is null, clearing the value.');
            if (from === "AucFromTime") {
                setAucFromTime({
                    data: null,
                    data_save: "",
                    error: ""
                });
            } else if (from === "AucToTime") {
                setAucToTime({
                    data: null,
                    data_save: "",
                    error: ""
                });
            }
        }
    };

    const HandleShowEstimateClick = () => {
        setShowEstimateListAlert(true);
        GetChitEstimateList(SelectAuctionList.installno);
    };

    const HandleAddMemberClick = () => {
        if (CompanyMemberId > 0) {
            setAlertMessage("Can't add member for this auction, This Auction allotted for company.");
            setAlertFrom("error_alert");
            HandleAlertShow();
        } else {
            setAddMemberListAlert(true);
            GetChitAuctionAddMemberList(filterTicketNo, filterName,dialogPage * dialogRowsPerPage, dialogRowsPerPage)
        }
    };

    const HandleResetClick = () => {
        setInstNo(prevState => ({
            ...prevState,
            data: "",
            error: ""
        }));
        setDividend(prevState => ({
            ...prevState,
            data: "",
            error: ""
        }));
        setPrizedMember(prevState => ({
            ...prevState,
            data: "",
            error: ""
        }));
        setTktNo(prevState => ({
            ...prevState,
            data: "",
            error: ""
        }));
        setMaxADisc(prevState => ({
            ...prevState,
            data: "",
            error: ""
        }));
    };

    const HandleDeleteClick = (from) => {
        console.log(SelectAuctionList);
        if (from === "popup_delete") {
            if (String(SelectAuctionList.primary_id).includes('id_')) {
                setChitAuctionMemberList([]);
            } else {
                setDeleteAlert(false);
                ChitAuctionEntryDeleteMethod(SelectedId);
            }
        } else {
            const isEmptyObject = (obj) => Object.keys(obj).length === 0;
            if (isEmptyObject(SelectAuctionList)) {
                setAlertMessage("Please select Auction");
                setAlertFrom("error_alert");
                HandleAlertShow();
            } else {
                HandleDelete();
            }
        }
    };

    const HandleDelete = () => {
        if (String(SelectAuctionList.primary_id).includes('id_')) {
            setChitAuctionMemberList([]);
            setAucFromTime({
                data: null,
                data_save: "",
                error: ""
            });
            setAucToTime({
                data: null,
                data_save: "",
                error: ""
            });
            setAucDate({
                data: null,
                data_save: "",
                error: ""
            });
            HandleResetClick();
        } else {
            GetChitPaymentList(SelectAuctionList.installno);
            GetChitReceiptList(SelectAuctionList.installno);
            setDeleteAlert(true);
        }
    }

    const handleClick = (event, item, from, index) => {
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
        setSelectedDateId(item.id);
        setSelected(newSelected);
        setChitAuctionSelectedIndex(index);
        console.log("item", item);
        if (from === "auction_list_click") {
            console.log(index);
            console.log(ChitAuctionListTotal);
            if (index > ChitAuctionListTotal) {
                setAlertMessage("Please add the previous auction entry .");
                setAlertFrom("error_alert");
                HandleAlertShow();
            } else {
                HandlePaymentNotSettledAlert(item, index);
            }
        } else {
            console.log("ChitAuctionMemberList", ChitAuctionMemberList);
            const checkIdExists = id => ChitAuctionMemberList.some(items => items.memberid === id);
            const checkTktnoExists = tktno => ChitAuctionMemberList.some(items => String(items.tktno) === tktno);
            console.log(checkIdExists(item.memberid), " -- ", checkTktnoExists(item.tktno));
            // row.prizedOrNot === "notPrized"
            if (String(item.id).includes('id_')) {
                if (checkIdExists(item.memberid) && checkTktnoExists(item.tktno)) {
                    setAlertMessage("Already this member is added");
                    setAlertFrom("error_alert");
                    HandleAlertShow();
                } else {
                    const updatedItem = {
                        ...item,
                        ...SelectAuctionList,
                        memberid: item.memberid,
                        member_name: item.mem_name,
                        group_member_id: item.id,
                        maxaucdisc: "0",
                        signature: "",
                        prized_amount: item.amount,
                        is_prizedmember: "1",
                        tktno: item.tktno,
                        action: 'delete',
                        is_companymember: "not_companymember"
                    };
                    console.log("updatedItem", updatedItem);
                    setInstNo({
                        data: updatedItem.installno,
                        error: ""
                    });
                    setDividend({
                        data: updatedItem.dividend,
                        error: ""
                    });
                    setPrizedMember({
                        data: updatedItem.member_name,
                        error: ""
                    });
                    setTktNo({
                        data: updatedItem.installno,
                        error: ""
                    });
                    setMaxADisc({
                        data: updatedItem.maxaucdisc,
                        error: ""
                    });
                    setSelectAuctionList(updatedItem);
                    setChitAuctionMemberList([...ChitAuctionMemberList, updatedItem]);
                    setAddMemberListAlert(false);
                }
            } else {
                handleItemUpdate(item);
            }
        }
    };

    function HandlePaymentNotSettledAlert(item, index) {
        if (index === ChitAuctionListTotal && ChitParameter.length > 0) {
            setAlertMessage("Payment not settled for previous auction entry");
            setAlertFrom("error_alert");
            HandleAlertShow();
        } else {
            // console.log("index", index, "ChitAuctionListTotal", ChitAuctionListTotal, "ChitParameter.length", ChitParameter.length);
                if(index < ChitAuctionListTotal -1)
                {
                    setEditable(false);
                }else if(index === ChitAuctionListTotal - 1 && ChitParameter.length > 0){
                    setEditable(true);
                }else{
                    setEditable(false);
                }
            GetChitEstimateList(item.installno);
            if (String(item.primary_id).includes('id_')) {
                setSelectedId(item.primary_id);
                setSelectAuctionList(item);
                if (item.id === "0") {
                    setChitAuctionMemberListLoading(true);
                    GetStandingInstructionList(item, "1");
                } else {
                    HandleResetClick();
                    setAucFromTime({
                        data: null,
                        data_save: "",
                        error: ""
                    });
                    setAucToTime({
                        data: null,
                        data_save: "",
                        error: ""
                    });
                    setAucDate({
                        data: null,
                        data_save: "",
                        error: ""
                    });
                    setChitAuctionMemberList([]);
                }
            } else {
                GetStandingInstructionList(item, "2");
                setDividend({
                    data: item.dividend,
                    error: ""
                });
                if (item.auction_time !== null && item.auction_time !== "") {
                    const times = item.auction_time.split(' to ');
                    if (times.length === 2) {
                        setAucFromTime({
                            data: dayjs(times[0], 'hh:mm A'),
                            data_save: dayjs(times[0], 'hh:mm A'),
                            error: ""
                        });
                        setAucToTime({
                            data: dayjs(times[1], 'hh:mm A'),
                            data_save: dayjs(times[1], 'hh:mm A'),
                            error: ""
                        });
                    }
                }
                setSelectedId(item.id);
                GetChitAuctionMemberList(item.id, item);
            }
        }
    }

    function handleItemUpdate(item) {
        console.log("handleItemUpdate", item);
        const checkIdExists = id => ChitAuctionMemberList.some(items => items.memberid === id);
        const checkTktnoExists = tktno => ChitAuctionMemberList.some(items => String(items.tktno) === tktno);
        console.log(checkIdExists(item.memberid), " --- ", checkTktnoExists(item.tktno));
        if (item.prizedOrNot === "Prized") {
            setAlertMessage("Already this member is added");
            setAlertFrom("error_alert");
            HandleAlertShow();
        } else if (checkIdExists(item.memberid) && checkTktnoExists(item.tktno)) {
            setAlertMessage("Already this member is added");
            setAlertFrom("error_alert");
            HandleAlertShow();
        } else {
            const updatedItem = {
                ...item,
                ...SelectAuctionList,
                memberid: item.memberid,
                member_name: item.mem_name,
                group_member_id: item.id,
                maxaucdisc: "0",
                signature: "",
                prized_amount: item.amount,
                is_prizedmember: item.is_prizedmember,
                tktno: item.tktno,
                action: 'delete',
                is_companymember: "not_companymember"
            };
            console.log("updatedItem1", updatedItem);
            if(CompanyMemberId > 0){
                setInstNo({
                    data: updatedItem.installno,
                    error: ""
                });
                setDividend({
                    data: updatedItem.dividend,
                    error: ""
                });
                setPrizedMember({
                    data: updatedItem.member_name,
                    error: ""
                });
                setTktNo({
                    data: updatedItem.installno,
                    error: ""
                });
                setMaxADisc({
                    data: updatedItem.maxaucdisc,
                    error: ""
                });
            }
            setSelectAuctionList(updatedItem);
            setChitAuctionMemberList([...ChitAuctionMemberList, updatedItem]);
            setAddMemberListAlert(false);
        }
    }

    const HandleFilterMemberName = (event) => {
        setPage(0);
        setChitAuctionAddMemberList([]);
        setFilterName(event.target.value);
    };

    const HandleFilterTicketNo = (event) => {
        setPage(0);
        setChitAuctionAddMemberList([]);
        setfilterTicketNo(event.target.value);
    };

    const HandleMemberListAlertClose = () => {
        setAddMemberListAlert(false);
    };

    const CustomTextField = styled(TextField)(({ theme }) => ({
        '& .MuiInputBase-root': {
            borderBottom: '1px solid', // Add bottom border
            borderRadius: 0, // Remove border radius
            padding: '4px', // Adjust padding to reduce size
            backgroundColor: 'transparent', // Remove background color
            fontSize: '0.75rem', // Smaller font size
            height: '32px', // Fixed input height
            width: '100%', // Ensure it takes full width
        },
        '& .MuiInputBase-input': {
            padding: '0 4px', // Adjust input padding
            minWidth: 0, // Ensure the input field can shrink to fit
            fontSize: '0.75rem', // Match font size of input
        },
        '& .MuiSvgIcon-root': {
            fontSize: '1rem', // Decrease icon size
        },
    }));


    const handleChangeDialogPage = (event, newPage) => {
        setDialogPage(newPage);
    };

    const handleChangeDialogRowsPerPage = (event) => {
        setDialogPage(0);
        setChitAuctionAddMemberList([]);
        setDialogRowsPerPage(parseInt(event.target.value, 10));
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

    const HandlePreviousScreen = () => {
        navigate('/chitauction/list');
    }

    if (!location.state) {
        return <ScreenError HandlePreviousScreen={HandlePreviousScreen} />
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <div style={{ marginLeft: '35px', marginRight: '35px' }} className='chitauction-add-screen'>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight:'600px'}}>
                    Chit Auction
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box className="con" component="form"
                    sx={{ '& .MuiTextField-root': { m: 2 }, }}
                    noValidate
                    autoComplete="off">
                    {ChitAuctionLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                        <Grid container spacing={2} class="mb-grid">
                         <Grid item xs={12} sm={6} md={6} className='box-grid'>
                                <Stack direction="column" className="st">
                                    <Scrollbar className="table-one">
                                    <div style={{paddingLeft:'10px'}}>
                                        <TableContainer sx={{ overflow: 'unset', mt: 1 }}>
                                            <Table sx={{ minWidth: 450 }}>
                                                <TableRow hover tabIndex={-1}>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Inst.No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Auc.Date</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Prized Member</TableCell>
                                                </TableRow>
                                                <TableBody>
                                                    {ChitAuctionList
                                                        .map((row, index) => (
                                                            <TableRow
                                                                hover
                                                                tabIndex={-1}
                                                                role="checkbox"
                                                                sx={{ cursor: 'pointer' }}
                                                                onClick={(event) => {
                                                                    if (event.target.closest('.MuiDatePicker-root')) {
                                                                        return;
                                                                    }
                                                                    event.stopPropagation();
                                                                    handleClick(event, row, "auction_list_click", index);
                                                                }} >
                                                                <TableCell sx={{ width: '6%' }}>{row.installno}</TableCell>
                                                                <TableCell sx={{ width: '40%', padding: 0 }}>
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <button
                                                                            type="button"
                                                                            tabIndex={0}
                                                                            aria-label="Open date picker"
                                                                            onClick={(event) => { event.stopPropagation(); }}
                                                                            onKeyDown={(event) => {
                                                                                if (event.key === 'Enter' || event.key === ' ') {
                                                                                    event.stopPropagation();
                                                                                }
                                                                            }}
                                                                            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent',
                                                                                padding: 0, cursor: 'pointer', }} >
                                                                            <DatePicker
                                                                                id="filled-hidden-label-normal"
                                                                                value={row.auctiondate != null ? dayjs(row.auctiondate) : null}
                                                                                onChange={(date) => { HandleDateChange(date, "auctiondate", row) }}
                                                                                format="DD-MM-YYYY"
                                                                                renderInput={(params) => (
                                                                                    <CustomTextField
                                                                                        {...params}
                                                                                        variant="filled"
                                                                                        sx={{ width: '100%', height: '20px', }} />
                                                                                )}
                                                                                sx={{ fontSize: "15px", '& .MuiInputBase-input': { padding: '5px', fontSize: '14px', }, }} />
                                                                        </button>
                                                                    </LocalizationProvider>
                                                                </TableCell>
                                                                <TableCell sx={{ width: '50%' }}>{row.prized_member_name}</TableCell>
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
                                        </div>
                                    </Scrollbar>
                                    <Scrollbar className="table-one">
                                      <div style={{paddingLeft:'10px'}}>
                                        <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
                                            <Table sx={{ minWidth: 490 }}>
                                                <TableRow hover tabIndex={-1}>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Tkt.No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Max.Auc.Disc</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Sign</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} align='right'>Action</TableCell>
                                                </TableRow>
                                                {ChitAuctionMemberListLoading
                                                    ? <TableRow>
                                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                            <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                        </TableCell>
                                                    </TableRow>
                                                    : <TableBody>
                                                        {ChitAuctionMemberList.map((row, index) => {
                                                            // const isEditable = String(row.id).includes('id_') || (index === ChitAuctionMemberList.length - 1 && !String(row.id).includes('id_'));
                                                                                                                        
                                                            // if(row.id !==0 && row.id !=="0")
                                                            // {
                                                            //     if( ChitParameter.length > 0)
                                                            //     {
                                                            //         setEditable(true);
                                                            //     }                                                                
                                                            // } 
                                                            const validatemaxaucdisc = isEditable || row.id === "0" || row.id === 0 ? (e) => ChitAuctionMemberListTextValidate(e, row, "maxaucdisc") : null;
                                                            const validatesignature = isEditable || row.id === "0" || row.id === 0 ? (e) => ChitAuctionMemberListTextValidate(e, row, "signature") : null
                                                            console.log("isEditable", isEditable);
                                                            console.log("ChitAuctionSelectedIndex", (ChitAuctionSelectedIndex+1));
                                                            console.log("row.id", row.id);
                                                            // console.log("ChitParameter.length", ChitParameter.length);
                                                            return (
                                                                <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }} key={index}>
                                                                    <TableCell>{row.tktno}</TableCell>
                                                                    <TableCell>{row.member_name}</TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            className='input-box2'
                                                                            id="outlined-required"
                                                                            value={row.maxaucdisc}
                                                                            onChange={row.is_companymember === "companymember" ? null : validatemaxaucdisc}
                                                                            style={{ width: 100, }}
                                                                            disabled={!isEditable && row.id !=="0" && row.id !==0}
                                                                            sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px',  },
                                                                                '& .MuiInputAdornment-root': { padding: '8px', } }}/>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Stack justifyContent='center'>
                                                                            <TextField
                                                                                className='input-box2'
                                                                                id="outlined-required"
                                                                                value={row.signature}
                                                                                onChange={row.is_companymember === "companymember" ? null : validatesignature}
                                                                                style={{ width: 100,  }}
                                                                                disabled={!isEditable && row.id !=="0" && row.id !==0}
                                                                                sx={{ '& .MuiInputBase-input': { padding: '8px', fontSize: '14px', },
                                                                                    '& .MuiInputAdornment-root': { padding: '8px', } }}/>
                                                                        </Stack>
                                                                    </TableCell>
                                                                    <TableCell>{row.action === "delete" &&
                                                                        <IconButton onClick={() => setChitAuctionMemberList(prevList => prevList.filter((_, i) => i !== index))} sx={{ cursor: 'pointer'}}>
                                                                            <Iconify icon="streamline:delete-1-solid" sx={{ width:12,height:12}} />
                                                                        </IconButton>}
                                                                    </TableCell>
                                                                </TableRow> ); })}
                                                        <TableEmptyRows
                                                            height={77}
                                                            emptyRows={emptyRows(0, 15, ChitAuctionMemberList.length)} />
                                                        {ChitAuctionMemberList.length === 0 && <TableNoData query="" />}
                                                    </TableBody>}
                                            </Table>
                                        </TableContainer>
                                    </div>
                                    </Scrollbar>
                                    </Stack>
                                </Grid>
                        <Grid item xs={12} sm={6} md={6} className='box-grid pd'>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Group No <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1 md'
                                                id="outlined-required"
                                                disabled
                                                // label="Group No"
                                                value={GroupNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "GroupNo")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                      fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!GroupNo.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{GroupNo.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='auction-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Amount <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                // label="Amount"
                                                value={Amount.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Amount")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                      fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!Amount.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{Amount.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp box'>
                                    <Stack direction='column' className='box-d'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Auc From Time <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['MobileTimePicker',]} className="date-pick">
                                                    <MobileTimePicker
                                                        // label="Auc From Time"
                                                        disabled={screen === "view"}
                                                        defaultValue={dayjs()}
                                                        value={AucFromTime.data}
                                                        onAccept={() => HandleOnAcceptTimeChange("Accept_AucFromTime")}
                                                        onChange={(time) => HandleTimeChange(time, "AucFromTime")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                              padding: '8px',
                                                              fontSize:'14px'
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                              padding: '8px',
                                                            },
                                                          }}
                                                          error={!!AucFromTime.error}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        {/* <div  className='error_txt'>{AucFromTime.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='auction-grp box'>
                                    <Stack direction='column' className='box-d'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Auc To Time <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['MobileTimePicker',]} className="date-pick">
                                                    <MobileTimePicker
                                                        // label="Auc To Time"
                                                        disabled={screen === "view"}
                                                        defaultValue={dayjs()}
                                                        value={AucToTime.data}
                                                        onAccept={() => HandleOnAcceptTimeChange("Accept_AucToTime")}
                                                        onChange={(time) => HandleTimeChange(time, "AucToTime")}
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                              padding: '8px',
                                                               fontSize:'14px' ,
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                              padding: '8px',
                                                            },
                                                          }}
                                                          error={!!AucToTime.error}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        {/* <div  className='error_txt'>{AucToTime.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp box'>
                                    <Stack direction='column' className='box-d'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Auc Date <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker']} className="date-pick">
                                                    <DatePicker
                                                        // label="Auc Date"
                                                        disabled={screen === "view" || screen === "add"}
                                                        value={AucDate.data}
                                                        onChange={(date) => HandleDateChange(date, "AucDate")}
                                                        format="DD-MM-YYYY"
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                              padding: '8px',
                                                              fontSize:'14px',
                                                            },
                                                            '& .MuiInputAdornment-root': {
                                                              padding: '8px',
                                                            },
                                                          }}
                                                          error={!!AucDate.error}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Stack>
                                        {/* <div  className='error_txt'>{AucDate.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='auction-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Inst No <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                // label="Inst No"
                                                value={InstNo.data}
                                                 onChange={(e) => ChitAuctionTextValidate(e, "InstNo")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!InstNo.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{InstNo.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Prized Member <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1 md'
                                                id="outlined-required"
                                                disabled
                                                // label="Prized Member"
                                                value={PrizedMember.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "PrizedMember")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!PrizedMember.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{PrizedMember.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='auction-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            Tkt.No <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                // label="Tkt.No"
                                                value={TktNo.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "TktNo")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!TktNo.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{TktNo.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp  grp-label'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                            Max.A.Disc <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1 md'
                                                id="outlined-required"
                                                disabled
                                                // label="Max.A.Disc"
                                                value={MaxADisc.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "MaxADisc")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!MaxADisc.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{MaxADisc.error}</div> */}
                                    </Stack>
                                </div>
                                <div className='auction-grp'>
                                    <Stack direction='column'>
                                        <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                            F.M/A.F.M Commission
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                // label="F.M/A.F.M Commission"
                                                value={FM_AFMCommission.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "FM_AFMCommission")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!FM_AFMCommission.error}/>
                                        </Stack>
                                        {/* <div  className='error_txt'>{FM_AFMCommission.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems='center' className='auction-box'>
                                <div className='auction-grp'>
                                    <Stack direction='column'>
                                        <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                            Dividend <span style={{ color: 'red' }}> *</span>
                                        </Typography>
                                        <Stack direction='row' sx={{ ml: 0, }}>
                                            <TextField
                                                className='input-box1'
                                                id="outlined-required"
                                                disabled
                                                // label="Dividend"
                                                value={Dividend.data}
                                                onChange={(e) => ChitAuctionTextValidate(e, "Dividend")}
                                                style={{}}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                      padding: '8px',
                                                       fontSize:'14px' ,
                                                    }
                                                  }}
                                                  error={!!Dividend.error}/>
                                        </Stack>
                                        {/* <div className='error_txt'>{Dividend.error}</div> */}
                                    </Stack>
                                </div>
                            </Stack>
                            </Grid>
                           
                            </Grid>
                            <Stack direction='column' alignItems='flex-start' gap='10px' sx={{ mt: 1, mb: 3, ml:2}}>
                                <Stack direction='row'>
                                    <Button sx={{ mr:2,  cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                        {Loading
                                            ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                            : ("Submit")}
                                    </Button>
                                    <Button variant="contained"   sx={{
                                        mr: 2,  cursor: 'pointer',
                                        backgroundColor: '#e9e9e9',
                                        color:'#7e8299',
                                        '&:hover': {
                                            backgroundColor: '#cccccc',
                                        },
                                    }} onClick={HandleResetClick}>
                                        Reset
                                    </Button>
                                    {Object.keys(SelectAuctionList).length > 0 && <Button sx={{ mr: 2,  cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleAddMemberClick}>
                                        Add Member
                                    </Button>}
                                    {Object.keys(SelectAuctionList).length > 0 && <Button sx={{ mr: 2,  cursor: 'pointer' }} variant="contained" className='custom-button' onClick={HandleShowEstimateClick}>
                                        Show Estimate
                                    </Button>}
                                    <Button variant="contained" sx={{ mr: 2, cursor: 'pointer',
                                        backgroundColor: '#d32f2f',
                                        color:'white', 
                                        '&:hover': {
                                         backgroundColor: '#b71c1c',
                                        },
                                       
                                      }} onClick={() => HandleDeleteClick("delete")}>
                                        Delete
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>}
                </Box>
            </Card>
            <Portal>
                <Snackbar open={AlertOpen} autoHideDuration={AlertFrom === "error_alert" ? 2000 : 1000} onClose={HandleAlertClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: '60px' }}>
                    <Alert
                        onClose={HandleAlertClose}
                        severity={AlertFrom === "failed" || AlertFrom === "error_alert" ? "error" : "success"}
                        variant="filled"
                        sx={{ width: '100%' }} >
                        {AlertMessage}
                    </Alert>
                </Snackbar>
            </Portal>
            <Dialog
                open={ShowEstimateListAlert}
                fullWidth={600}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>
                    <Stack>
                        <Stack ml={1} mr={1} pb={1} direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                    { `Group No - ${GroupNo.data}`}
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={() => setShowEstimateListAlert(false)}
                                sx={{ position: 'absolute', right: 10, top: 11, color: (theme) => theme.palette.grey[500], cursor: 'pointer', }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14, }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 1, }}/>
                        <Scrollbar style={{ Scrollbar: 'none' }}>
                            <Stack direction='column' sx={{ m: 3 }}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Chit Amount
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.payment || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Ticket No
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.ticket_no || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Installment No
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.Instno || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Member Name
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.member_names || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" >
                                                Auction Date
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.auctiondate ? dayjs(ChitEstimateList.auctiondate).format('DD-MM-YYYY') : "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Less Amount
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.less_amount || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Payment Amount
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.payment || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Particulars
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.particulars || "--"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 1 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                Due Amount
                                            </Typography>
                                            <Stack direction='row'>
                                                <Typography variant="subtitle1" className='show-estimate'>
                                                    {ChitEstimateList.dueamount || "--"}
                                                </Typography>
                                            </Stack>
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
                        <Stack ml={1} mr={1} pb={1}direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                         <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 1 }}>
                                 Member List
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
                        <Divider sx={{ mt: 1, }}/>
                        <Stack mt={2} ml={2} mr={1} direction="row" alignItems="center" gap="10px">
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
                                }}
                                sx={{
                                    '& .MuiInputBase-input': {
                                      padding: '8px',
                                      fontSize:'14px' 
                                    },
                                    '& .MuiInputAdornment-root': {
                                      padding: '8px', 
                                    },
                                  }}/>
                            <TextField
                                placeholder="Ticket No..."
                                value={filterTicketNo}
                                onChange={(e) => HandleFilterTicketNo(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                                            />
                                        </InputAdornment>),
                                }}
                                sx={{ ml: 1,
                                    '& .MuiInputBase-input': {
                                      padding: '8px',
                                      fontSize:'14px' 
                                    },
                                    '& .MuiInputAdornment-root': {
                                      padding: '8px', 
                                    },
                                  }}/>
                          
                        </Stack>
                        <Scrollbar style={{ maxHeight: '70vh'}}>
                            <div style={{ marginLeft: '15px', marginRight: '15px' ,marginBottom:'15px'}}>
                                <TableContainer sx={{ overflow: 'unset', mt:2 }}>
                                    <Table sx={{ minWidth: 530 }} stickyHeader>
                                        <TableRow hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Account No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Tkt No</TableCell>
                                        </TableRow>
                                        {ChitAuctionAddMemberListLoading
                                            ? <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                </TableCell>
                                            </TableRow>
                                            : <TableBody>
                                                {ChitAuctionAddMemberList.slice(dialogPage * dialogRowsPerPage, dialogPage * dialogRowsPerPage + dialogRowsPerPage)
                                                    .map((row, index) => {
                                                        const checkIdExists = id => ChitAuctionMemberList.some(items => items.memberid === id);
                                                        const checkTktnoExists = tktno => ChitAuctionMemberList.some(items => String(items.tktno) === tktno);
                                                        return(
                                                            <TableRow hover={!(row.prizedOrNot === "Prized")} tabIndex={-1} role="checkbox"
                                                                className={(row.prizedOrNot === "Prized" || (checkIdExists(row.memberid) && checkTktnoExists(row.tktno))) && 'rowExists'}
                                                                onClick={(event) => handleClick(event, row, "", index)} sx={{ cursor: 'pointer' }}>
                                                                <TableCell>{row.mem_name}</TableCell>
                                                                <TableCell>{row.memberid}</TableCell>
                                                                <TableCell>{row.tktno}</TableCell>
                                                            </TableRow>)})}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(page, 5, ChitAuctionAddMemberList.length)} />
                                                {ChitAuctionAddMemberList.length === 0 && <TableNoData query={filterName} />}
                                            </TableBody>}
                                    </Table>
                                </TableContainer>
                            </div>
                            {ChitAuctionAddMemberList.length > 0 &&
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
                        </Scrollbar>                     
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={DeleteAlert}
                fullWidth={600}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>
                    <Stack>
                        <Stack mt={2} ml={2} mr={1} direction="row" alignItems="center" >
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                    {`Auction No - ${SelectAuctionList && SelectAuctionList.installno ? SelectAuctionList.installno : ""}`}
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                className='btn-close'
                                onClick={() => setDeleteAlert(false)}
                                sx={{ position: 'absolute', right: 2, top: 0, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }} >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17, }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 3, }} />
                        <Scrollbar>
                            <Stack direction='column' sx={{ m: 4 }}>
                                <Stack direction='row' spacing={2} alignItems='center'>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                No. of Auction(s) after this Auction:
                                            </Typography>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                {ChitAuctionListTotal - (ChitAuctionSelectedIndex + 1)}
                                            </Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                No.of Chit Receipt(s) for this Auction:
                                            </Typography>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                {ChitReceiptListTotal}
                                            </Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' spacing={2} alignItems='center' sx={{ mt: 3 }}>
                                    <div className='auction-grp  grp-label'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1" >
                                                No.of Chit Payment for this Auction:
                                            </Typography>
                                        </Stack>
                                    </div>
                                    <div className='auction-grp'>
                                        <Stack direction='column'>
                                            <Typography variant="subtitle1">
                                                {ChitPaymentListTotal}
                                            </Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                                <Stack direction='row' alignItems='center' sx={{ mt: 3 }}>
                                    <div className='auction-grp  grp-label'>
                                        {((ChitAuctionListTotal - (ChitAuctionSelectedIndex + 1)) !== 0 && ChitReceiptListTotal !== 0 && ChitPaymentListTotal !== 0)
                                            && <Stack direction='column' justifyContent='center' alignItems='center'>
                                                <div style={{ marginLeft: "25px", marginTop: "-10px", color: 'red', fontSize: "14px", fontWeight: "500", }}>*Delete above listed transaction(s).</div>
                                            </Stack>}
                                        <Stack direction='column' sx={{ mt: 4, mb: 3, }}>
                                            <Stack direction='row'>
                                                {((ChitAuctionListTotal - (ChitAuctionSelectedIndex + 1)) === 0 && ChitReceiptListTotal === 0 && ChitPaymentListTotal === 0)
                                                    && <Button sx={{ mr: 2, height: 50, width: 100, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={() => HandleDeleteClick("popup_delete")}>
                                                        {DeleteLoading
                                                            ? <img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />
                                                            : "Delete"}
                                                    </Button>}
                                                <Button sx={{ mr: 3, height: 50, width: 100, cursor: 'pointer' }} variant="contained" className='custom-button' onClick={() => setDeleteAlert(false)}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Stack>

                            
                        </Scrollbar>
                    </Stack>
                </Card>
            </Dialog>
        </div>
    );
}