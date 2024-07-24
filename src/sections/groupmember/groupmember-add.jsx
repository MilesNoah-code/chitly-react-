import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Box, Grid, Stack, Alert, Button, Dialog, Divider, Snackbar, Typography, IconButton, DialogTitle, DialogActions, InputAdornment } from '@mui/material';

import { GetHeader, PostHeader, DeleteHeader, } from 'src/hooks/AxiosApiFetch';

import { MEMBER_LIST, ADDRESS_DETAIL, GROUP_MEMBER_LIST, GROUP_MEMBER_SAVE, REACT_APP_HOST_URL, GROUP_MEMBER_DELETE } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';
import ScreenError from 'src/Error/ScreenError';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './groupmember-add.css';
import { emptyRows } from '../member/utils';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import GroupMemberTableRow from './groupmember-member-list';

export default function AddGroupMemberPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { screen, data } = location.state || {};
    const Session = localStorage.getItem('apiToken');
    const [Loading, setLoading] = useState(false);
    const [AlertOpen, setAlertOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState('');
    const [AlertFrom, setAlertFrom] = useState('');
    const [ErrorAlert, setErrorAlert] = useState(false);
    const [ErrorScreen, setErrorScreen] = useState('');
    const [ScreenRefresh, setScreenRefresh] = useState(0);
    // const ImageUrl = JSON.parse(localStorage.getItem('imageUrl'));
    const [GroupMemberList, setGroupMemberList] = useState([]);
    const [GroupMemberLoading, setGroupMemberLoading] = useState(true);
    const [memberDetail, setMemberDetail] = useState({});
    const [MemberListAlert, setMemberListAlert] = useState(false);
    const [MemberListLoading, setMemberListLoading] = useState(true);
    const [MemberList, setMemberList] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [TotalCount, setTotalCount] = useState('');
    const [SelectedIndex, setSelectedIndex] = useState('');
    const [TicketNoClick, setTicketNoClick] = useState('');

    const [GroupMemberId, setGroupMemberId] = useState('');
    const [MemberDeleteAlert, setMemberDeleteAlert] = useState(false);
    const [SelectedMember, setSelectedMember] = useState({});
    const [DetailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        GetGroupMemberList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    useEffect(() => {
        setTotalCount(0);
        setMemberList([]);
        GetMemberList(1, filterName, page * rowsPerPage, rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, filterName]);

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

    const GetGroupMemberList = () => {
        // const memberId = '';
        setGroupMemberLoading(true);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}&id=&groupId=${data?.id ? data.id : ""}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setGroupMemberLoading(false);
                if (json.success) {
                    const { list } = json;
                    const { groupno, groupId, groupAddressId, amount, duration, auction_mode } = json.list.length > 0 ? list[0] : [];
                    const commonProperties = json.list.length > 0 ? {
                        groupno,
                        groupId,
                        groupAddressId,
                        amount,
                        duration,
                        auction_mode
                    } : {};
                    // Initialize newList with empty slots based on duration
                    const newList = Array.from({ length: json.list.length > 0 ? list[0].duration : data.duration }, (_, index) => ({
                        primary_id: `empty_${index}`,
                        memberName: '',
                        tktno: index + 1,
                        action: "add",
                        ...commonProperties
                    }));

                    // Place each member at the correct index based on tktno
                    if(json.list.length > 0){
                        list.forEach((member) => {
                            const index = member.tktno - 1; // Adjust tktno to be 0-based index
                            if (index >= 0 && index < list[0].duration) {
                                newList[index] = { ...newList[index], ...member, action: "delete", primary_id: member.id };
                            }
                        });
                        GetMemberDetail(1, newList[0], 2, '');
                    }
                    
                    // console.log(JSON.stringify(newList));
                    setGroupMemberList(newList);
                    
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
                // console.log(error);
                setGroupMemberLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
            });
    };

    const GetMemberDetail = (isActive, item, from, index) => {
        setMemberListLoading(true);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}&id=${item.id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setMemberListLoading(false);
                if (json.success) {
                    setTicketNoClick('');
                    if (json.list.length > 0) {
                        setMemberDetail(json.list[0]);
                        if (item.primary_id && String(item.primary_id).includes('empty_')) {
                            setGroupMemberId('');
                        } else {
                            setGroupMemberId(json.list[0].id);
                        }
                    } else {
                        setGroupMemberId('');
                    }
                    // console.log("from", from);
                    if (from === 4 || from === 3){
                        GetAddressView(item.memberId, item, "2");
                    }
                    if (from === 3) {
                        /* if (TicketNoClick) {
                            setAlertMessage("please save the already selected Ticket No");
                            setAlertFrom("save_alert");
                            HandleAlertShow();
                        }
                        if (index !== 0) {
                            GetMemberList(1, filterName, page * rowsPerPage, rowsPerPage);
                        } */
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
                setMemberListLoading(false);
                setMemberListAlert(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            });
    };

    const GetMemberList = (isActive, text, start, limit) => {
        setMemberListLoading(true);
        setTotalCount(0);
        setMemberList([]);
        const url = `${REACT_APP_HOST_URL}${MEMBER_LIST}${isActive}&search=${text}&start=${start}&limit=${limit}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setMemberListLoading(false);
                setGroupMemberId('');
                if (json.success) {
                    setTotalCount(json.total);
                    setMemberList([...MemberList, ...json.list]);
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
                // console.log(error);
            })
    }

    const GetAddressView = (id, memberDetails, from) => {
        const url = `${REACT_APP_HOST_URL}${ADDRESS_DETAIL}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setDetailLoading(false);
                if (json.success) {
                    if (json.list !== null) {
                        const updatedItem = {
                            ...memberDetails,
                            ...json.list,
                            addressId: json.list.id
                        };
                        // console.log(updatedItem)
                        if(from === "2"){
                            setTicketNoClick(updatedItem.tktno);
                        }
                        setMemberDetail(updatedItem);
                    } else {
                        setMemberDetail(memberDetails);
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
                setDetailLoading(false);
                setErrorAlert(true);
                setErrorScreen("error");
                // console.log(error);
            })
    }

    const GroupMemberInfoParams = {
        "groupid": memberDetail.groupId,
        "memberid": memberDetail.memberId,
        "tkt_suffix": "A",
        "tkt_percentage": "100",
        "tktno": memberDetail.tktno,
        "addressid": memberDetail && memberDetail.addressId ? memberDetail.addressId : "",
    }

    const GroupMemberUpdateInfoParams = {
        "groupid": memberDetail.groupId,
        "memberid": memberDetail.memberId,
        "tkt_suffix": "A",
        "tkt_percentage": "100",
        "tktno": memberDetail.tktno,
        "addressid": memberDetail && memberDetail.addressId ? memberDetail.addressId : "",
        "id": GroupMemberId
    }
    // groupmember update in request need to pass id param

    const GroupMemberAddMethod = (IsValidate) => {
        if (IsValidate) {
            setLoading(true);
            let url = '';
            let Params = '';
            url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_SAVE}`;
            if (GroupMemberId !== "") {
                Params = GroupMemberUpdateInfoParams;
            } else {
                Params = GroupMemberInfoParams;
            }
            console.log(JSON.stringify(Params) + url);
            fetch(url, PostHeader(JSON.parse(Session), Params))
                .then((response) => response.json())
                .then((json) => {
                    // console.log(JSON.stringify(json));
                    setLoading(false);
                    setScreenRefresh(0);
                    setGroupMemberId('');
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

    const GroupMemberDeleteMethod = (id) => {
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_DELETE}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, DeleteHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
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
        console.log("submitclick11" , memberDetail);
        if (memberDetail && Object.keys(memberDetail).length > 0){
            GroupMemberAddMethod(true);
        } else {
            setAlertMessage("please select a member");
            setAlertFrom("failed");
            HandleAlertShow();
        }
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
        // console.log("handle_item", item);
        // const checkIdExists = id => GroupMemberList.some(items => items.memberId === id);
        const updatedGroupMemberList = [...GroupMemberList];
        if (SelectedIndex >= 0 && SelectedIndex < updatedGroupMemberList.length) {
            const updatedItem = {
                ...updatedGroupMemberList[SelectedIndex],
                ...item,
                memberName: item.name,
                memberId: item.id,
                memdob: item.dob,
                action: "edit"
            };
            setTicketNoClick(updatedItem.tktno);
            console.log(updatedItem)
            updatedGroupMemberList[SelectedIndex] = updatedItem;
            setGroupMemberList(updatedGroupMemberList);
            setDetailLoading(true);
            GetAddressView(item.id, updatedItem, "");
        }
        setMemberListAlert(false);
        /* if (checkIdExists(item.id)) {
            setAlertMessage("Already this member is added");
            setAlertFrom("save_alert");
            HandleAlertShow();
        } */
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setTotalCount(0);
        setMemberList([]);
        setFilterName(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setTotalCount(0);
        setMemberList([]);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setMemberDetail((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const HandleBack = () => {
        if (ScreenRefresh) {
            const confirmNavigation = window.confirm(
                'You have unsaved changes. Are you sure you want to leave this page?'
            );
            if (confirmNavigation) {
                setScreenRefresh(0);
                window.location.reload();
            }
        } else {
            navigate('/groupMember/list');
        }
    }

    const HandleGroupMemberClick = (event, item, index, from) => {
        console.log("item1", item, "TicketNoClick1111", TicketNoClick);
        if (TicketNoClick !== "") {
            if (TicketNoClick === item.tktno) {
                if (from === "2") {
                    event.stopPropagation();
                    if (item.primary_id && String(item.primary_id).includes('empty_')) {
                        // console.log("item1234", item.primary_id);
                        setGroupMemberId('');
                    } else {
                        setSelectedMember(item);
                        GetMemberDetail(1, item, 3, index);
                    } 
                }
                if (item && item.action === "delete") {
                    // console.log("item12", item);
                    setSelectedMember(item);
                } 
            } else {
                setAlertMessage("please save the already selected Ticket No");
                setAlertFrom("save_alert");
                HandleAlertShow();
            }
        } else {
            HandleListClick(item, index, from);
        }
        
        
        if (from === "delete"){
            if (TicketNoClick !== "") {
                if (TicketNoClick === item.tktno) {
                    setMemberDeleteAlert(true);
                } else {
                    setAlertMessage("please save the already selected Ticket No");
                    setAlertFrom("save_alert");
                    HandleAlertShow();
                }
            } else {
                setMemberDeleteAlert(true);
            }
        } else if (from === "3") {
            setSelectedIndex(index);
            // console.log("TicketNoClick123", TicketNoClick, "item.tktno", item.tktno);
            if (TicketNoClick !== "") {
                if (TicketNoClick === item.tktno) {
                    setGroupMemberId('');
                    setMemberListAlert(true);
                } else {
                    setAlertMessage("please save the already selected Ticket No");
                    setAlertFrom("save_alert");
                    HandleAlertShow();
                }
            } else {
                setGroupMemberId('');
                setMemberListAlert(true);
            }
        }
    }

    const HandleListClick = (event, item, index, from) => {
        if (from === "2") {
            event.stopPropagation();
            setSelectedMember(item);
            console.log("item1234", item, "TicketNoClick1111", TicketNoClick);
            GetMemberDetail(1, item, 3, index);
        }
        if (item && item.action === "delete") {
            // console.log("item12", item);
            setSelectedMember(item);
        } 
    }

    const HandleGroupMemberEditClick = (event, item, index) => {
        console.log("item1", item, "TicketNoClick1111", TicketNoClick);
        if (TicketNoClick !== "") {
            if (TicketNoClick === item.tktno) {
                if (item.primary_id && String(item.primary_id).includes('empty_')) {
                    setGroupMemberId('');
                    setMemberListAlert(true);
                } else {
                    HandleMemberAddress(item, index);
                }
                setSelectedIndex(index);
            } else {
                setAlertMessage("please save the already selected Ticket No");
                setAlertFrom("save_alert");
                HandleAlertShow();
            }
        } else {
            if (item.primary_id && String(item.primary_id).includes('empty_')) {
                setGroupMemberId('');
                setMemberListAlert(true);
            } else {
                HandleMemberAddress(item, index);
            }
            setSelectedIndex(index);
        }
    }

    const HandleMemberAddress = (item, index) => {
        if (item.groupAddressId === "" || item.groupAddressId === null || item.groupAddressId === "0" || item.groupAddressId === 0) {
            setDetailLoading(true);
            GetMemberDetail(1, item, 4, index);
        }
    }

    const HandlePreviousScreen = () => {
        navigate('/groupMember/list');
    }

    const HandleMemberDeleteAlertClose = () => {
        setMemberDeleteAlert(false);
        if (AlertFrom === "success") {
            window.location.reload();
        }
    };

    const HandleConfirmYesClick = () => {
        setMemberDeleteAlert(false);
        // console.log("SelectedMember", SelectedMember, "SelectedIndex", SelectedIndex);
        if (SelectedMember && String(SelectedMember.primary_id).includes('empty_')){
            setGroupMemberList(prevList => prevList.map((item, i) => {
                if (i === SelectedIndex) {
                    return {
                        ...item,
                        memberName: '',
                        action: "add",
                    };
                }
                return item;
            }));
            GetGroupMemberList();
        } else {
            GroupMemberDeleteMethod(SelectedMember.id);
        }
    };

    if (!location.state) {
        return <ScreenError HandlePreviousScreen={HandlePreviousScreen} />
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <div style={{ marginLeft: '35px', marginRight: '35px' }}>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    Group Member
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
                    {GroupMemberLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Grid className='grid-UI' container spacing={2}>
                                <Grid className='table-grid' item xs={12} md={5}>
                                    <Scrollbar>
                                    <div style={{ marginLeft: '10px', marginRight: '0px' }}>
                                        <TableContainer sx={{ overflow: 'unset', mt: 2 }}>
                                            <Table sx={{ minWidth: 350 }}>
                                                <TableRow hover tabIndex={-1}>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Tkt No</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                                    <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }} align='right'>Action</TableCell>
                                                </TableRow>
                                                <TableBody>
                                                    {GroupMemberList
                                                        .map((row, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); HandleGroupMemberClick(event, row, index, "2")}} >
                                                                <TableCell sx={{ width: '25%' }}>{row.tktno}</TableCell>
                                                                <TableCell sx={{ width: '65%' }}>{row.memberName}</TableCell>
                                                                <TableCell sx={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                                                                    {row.tktno === "1" &&
                                                                        (row.address !== 0 && (<div style={{ display: 'flex', justifyContent: 'center', }}>
                                                                        <IconButton sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); HandleGroupMemberEditClick(event, row, index)}}>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </IconButton>
                                                                        </div>))}
                                                                    {row.tktno !== "1" &&
                                                                        (row.action === "add"
                                                                            ? <div style={{ display: 'flex', justifyContent: 'center', }}>
                                                                            <IconButton sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); HandleGroupMemberClick(event, row, index, "3")}}>
                                                                                    <Iconify icon="icon-park-solid:add-one" />
                                                                                </IconButton>
                                                                              </div>
                                                                        : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                            {(row.groupAddressId === "" || row.groupAddressId === null || row.groupAddressId === "0" || row.groupAddressId === 0
                                                                                || (row.primary_id && String(row.primary_id).includes('empty_'))) && 
                                                                                (<IconButton sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); HandleGroupMemberEditClick(event, row, index)}}>
                                                                                            <Iconify icon="eva:edit-fill" />
                                                                                        </IconButton>
                                                                                    )}
                                                                                    <IconButton sx={{ cursor: 'pointer' }} onClick={(event) => HandleGroupMemberClick(event, row, index, "delete")}>
                                                                                        <Iconify icon="eva:trash-2-outline" />
                                                                                    </IconButton>
                                                                                </div>) }
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    <TableEmptyRows
                                                        height={77}
                                                        emptyRows={emptyRows(0, 15, GroupMemberList.length)}
                                                    />
                                                    {GroupMemberList.length === 0 && <TableNoData query="" />}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        </div>
                                    </Scrollbar>
                                </Grid>
                                {DetailLoading
                                    ? <Stack style={{ flex: 1, }} mt={10} alignItems="center" justifyContent="center">
                                        <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                    </Stack>
                                    :
                                <Grid  className='table-grid' item xs={12} md={7}>
                                    <div className='detail'>
                                        <Typography variant="h6" className='detail-head' sx={{ mt: 0, ml: 2, }}>
                                            Group Detail:
                                        </Typography>
                                        <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" className='detail-sub' sx={{ ml: 2, mr: 2, mt: 1, mb: '0px' }}>
                                                        Group No
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                        <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0 }}>
                                                            {data.groupno || ''}
                                                        </Typography>

                                                    </Stack>
                                                </Stack>
                                            </div>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" className='detail-sub' sx={{ mt: 2, ml: 2 }}>
                                                        Amount
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                                {data.amount || ''}
                                                        </Typography>

                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                        <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" className='detail-sub' sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                        Duration
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                                {data.duration || ''}
                                                        </Typography>

                                                    </Stack>
                                                </Stack>
                                            </div>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" className='detail-sub' sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                        Auction Mode
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                                {data.auction_mode || ''}
                                                        </Typography>

                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                    </div>
                                    <div className='detail'>
                                        <Typography variant="h6" className='detail-head' sx={{ mt: 0, ml: 2, }}>
                                            Member Detail:
                                        </Typography>
                                        <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant='subtitle1' className='detail-sub' sx={{ mt: 2, ml: 2 }} >
                                                        Member Name
                                                    </Typography>
                                                <Stack direction='row' sx={{ ml: 2,}}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.memberName || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                            <div className='box-grp'>
                                                <Stack direction='column'>
                                                    <Typography variant="subtitle1" className='detail-sub' sx={{ mt: 2, ml: 2 }}>
                                                        Ticket No
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.tktno || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                            <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' className='detail-sub' sx={{ mt: 2, ml: 2 }} >
                                                    Member Id
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.memberId || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                            <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" className='detail-sub' sx={{ mt: 2, ml: 2 }}>
                                                    D.O.B
                                                    </Typography>
                                                <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                <Typography variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.memdob || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                            <div className='box-grp  grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" className='detail-sub' sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Mobile Number
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.mapped_phone || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                            <div className='box-grp grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" className='detail-sub' sx={{ mt: 2, ml: 2, mr:2 }}>
                                                    Email
                                                    </Typography>
                                                    <Stack direction='row' sx={{ ml: 2, mt: 0, }}>
                                                <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.email || ''}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </div>
                                        </Stack>
                                    </div>
                                    <div className='detail'>
                                    <Typography variant="h6" className='detail-head' sx={{ mt: 0, ml:2 }}>
                                            Address Detail:
                                        </Typography>
                                        {(memberDetail.addressline1 == null || memberDetail.addressline1 === '') && (memberDetail.city == null || memberDetail.city === '') &&
                                            (memberDetail.state == null || memberDetail.state === '') && (memberDetail.country == null || memberDetail.country === '')
                                            ? null
                                            : <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                                <div className='box-grp  grp-label'>
                                                    <Stack direction='column'>
                                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 1, mb: '0px' }}>
                                                            Address
                                                        </Typography>
                                                        <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                        <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.addressline1 || ''}
                                                        </Typography>
                                                            
                                                        </Stack>
                                                    </Stack>
                                                </div>
                                                <div className='box-grp'>
                                                    <Stack direction='column'>
                                                        <Typography variant="subtitle1" sx={{ mt: 1, ml: 2 }}>
                                                            City
                                                        </Typography>
                                                        <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                        <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.city || ''}
                                                        </Typography>
                                                                                                                   </Stack>
                                                    </Stack>
                                                </div>
                                            </Stack>}
                                        {(memberDetail.addressline1 == null || memberDetail.addressline1 === '') && (memberDetail.city == null || memberDetail.city === '') &&
                                            (memberDetail.state == null || memberDetail.state === '') && (memberDetail.country == null || memberDetail.country === '')
                                            ? null
                                            : <Stack direction='row' spacing={2} alignItems='center' className='member-box'>
                                                <div className='box-grp  grp-label'>
                                                    <Stack direction='column'>
                                                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 1, mb: '0px' }}>
                                                            State
                                                        </Typography>
                                                        <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                        <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.state || ''}
                                                        </Typography>
                                                                                                             </Stack>
                                                    </Stack>
                                                </div>
                                                <div className='box-grp'>
                                                    <Stack direction='column'>
                                                        <Typography variant="subtitle1" sx={{ mt: 1, ml: 2 }}>
                                                            Country
                                                        </Typography>
                                                        <Stack direction='row' sx={{ ml: 2, mt: 0 }}>
                                                        <Typography  variant="subtitle1" className='detail-sub1' sx={{ ml: 0,  }}>
                                                            {memberDetail.country|| ''}
                                                        </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </div>
                                            </Stack>}
                                        {((memberDetail.addressline1 == null || memberDetail.addressline1 === '') && (memberDetail.city == null || memberDetail.city === '') &&
                                            (memberDetail.state == null || memberDetail.state === '') && (memberDetail.country == null || memberDetail.country === ''))
                                            && <Typography variant="subtitle1" sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                                                No address mapped
                                            </Typography>}
                                    </div>
                                </Grid> }
                            </Grid>
                            <Stack direction='column' alignItems='flex-end'>
                                <Button sx={{ mr: 3, mt: 2, mb: 3,  cursor: 'pointer' }} variant="contained" className='custom-button' onClick={Loading ? null : HandleSubmitClick}>
                                    {Loading
                                        ? (<img src="/assets/images/img/white_loading.gif" alt="Loading" style={{ width: 30, height: 30, }} />)
                                        : ("Submit")}
                                </Button>
                            </Stack>
                        </Stack>}
                </Box>
            </Card>
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
            <Dialog
                open={MemberListAlert}
                fullWidth
                maxWidth='sm'
                sx={{ justifyContent: 'center', }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card>      
                    <Stack>
                           <Stack ml={1} mr={1} pb={1}direction="row" alignItems="center" sx={{ alignItems: 'center' }}>
                            <Stack direction='column'>
                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 1 }}>
                                  Member list
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="close"
                                onClick={() => setMemberListAlert(false)}
                                sx={{ position: 'absolute', right: 10, top: 11, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}
                            >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 14, height: 14 }} />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ mt: 0.5, mb:1}}/>
                        <Stack mt={1} ml={2} mr={1} direction="row" alignItems="center">
                            <TextField
                                placeholder="Member Name..."
                                value={filterName}
                                onChange={(e) => handleFilterByName(e)}
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
                                sx={{
                                    '& .MuiInputBase-input': {
                                      padding: '8px',
                                      fontSize:'14px' 
                                    },
                                    '& .MuiInputAdornment-root': {
                                      padding: '8px', 
                                    },
                                  }}
                            />
                          
                        </Stack>
                        <Box sx={{ flexGrow: 1,  mt: 0.3}}>
                            <Scrollbar  style={{ maxHeight: '70vh'}}>
                            <div style={{ marginLeft: '15px', marginRight: '15px' ,marginBottom:'15px'}}>
                                <TableContainer sx={{ overflow: 'unset'  }}>
                                    <Table sx={{ minWidth: 500 }} stickyHeader>
                                        <TableRow hover tabIndex={-1}>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Member Name</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Acc No</TableCell>
                                            <TableCell sx={{ background: '#edf4fe', color: '#1877f2', }}>Mobile Number</TableCell>
                                        </TableRow>
                                        {MemberListLoading
                                            ? <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <img className='load' src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                                </TableCell>
                                            </TableRow>
                                            : <TableBody>
                                                {MemberList
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row) => (
                                                        <GroupMemberTableRow
                                                            key={row.id}
                                                            selected={selected.indexOf(row.name) !== -1}
                                                            handleClick={(event) => handleClick(event, row)}
                                                            item={row} />))}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(page, rowsPerPage, MemberList.length)} />
                                                {MemberList.length === 0 && <TableNoData query={filterName} />}
                                            </TableBody>}
                                    </Table>
                                </TableContainer>
                                </div>
                          
                        {MemberList.length > 0 && <TablePagination
                            page={page}
                            component="div"
                            count={TotalCount}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[10, 20, 50]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ borderTop: '1px solid #e0e0e0' ,pt:0}}
                        />}
                          </Scrollbar>
                        </Box>
                    </Stack>
                </Card>
            </Dialog>
            <Dialog
                open={MemberDeleteAlert}
                onClose={HandleMemberDeleteAlertClose}
                maxWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <DialogTitle id="responsive-dialog-title">
                    Are you sure you want to delete this Member ?
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={HandleConfirmYesClick} sx={{ cursor: 'pointer' }}>
                        Yes
                    </Button>
                    <Button onClick={() => setMemberDeleteAlert(false)} autoFocus sx={{ cursor: 'pointer' }}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}