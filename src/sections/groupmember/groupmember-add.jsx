import { useState, useEffect } from 'react';
import { useLocation, } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Box, Grid, Stack, Alert, Button, Dialog, Snackbar, Typography, IconButton, InputAdornment } from '@mui/material';

import { GetHeader, PostHeader, } from 'src/hooks/AxiosApiFetch';

import { MEMBER_LIST, ADDRESS_DETAIL, GROUP_MEMBER_LIST, GROUP_MEMBER_SAVE, REACT_APP_HOST_URL, } from 'src/utils/api-constant';

import ErrorLayout from 'src/Error/ErrorLayout';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import './groupmember-add.css';
import { emptyRows } from '../member/utils';
import TableHeader from '../member/table-head';
import TableNoData from '../member/table-no-data';
import TableEmptyRows from '../member/table-empty-rows';
import GroupMemberTableRow from './groupmember-member-list';

export default function AddGroupMemberPage() {

    const location = useLocation();
    const { screen, data } = location.state;
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
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [TotalCount, setTotalCount] = useState('');
    const [SelectedIndex, setSelectedIndex] = useState('');
    const [TicketNoClick, setTicketNoClick] = useState(false);
    
    const [GroupMemberId, setGroupMemberId] = useState('');

    useEffect(() => {
        GetGroupMemberList();
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

    const GetGroupMemberList = () => {
        // const memberId = '';
        setGroupMemberLoading(true);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?id=&groupId=${data.id}`;
        console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json));
                setGroupMemberLoading(false);
                if (json.success) {
                    const { list } = json;
                    const { groupno, groupId, groupAddressId, amount, duration, auction_mode } = list[0];
                    const commonProperties = {
                        groupno,
                        groupId,
                        groupAddressId,
                        amount,
                        duration,
                        auction_mode
                    };
                    // Initialize newList with empty slots based on duration
                    const newList = Array.from({ length: list[0].duration }, (_, index) => ({
                        id: `empty_${index}`,
                        memberName: '',
                        tktno: index + 1,
                        action: "add",
                        ...commonProperties
                    }));

                    // Place each member at the correct index based on tktno
                    list.forEach((member) => {
                        const index = member.tktno - 1; // Adjust tktno to be 0-based index
                        if (index >= 0 && index < list[0].duration) {
                            newList[index] = { ...newList[index], ...member, action: "edit" };
                        }
                    });
                    // console.log(JSON.stringify(newList));
                    setGroupMemberList(newList);
                    GetMemberDetail(1, newList[0].id, 2, '')
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

    const GetMemberDetail = (isActive, id, from, index) => {
        setMemberListLoading(true);
        setTotalCount(0);
        setMemberList([]);
        const url = `${REACT_APP_HOST_URL}${GROUP_MEMBER_LIST}?id=${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    setTicketNoClick(false);
                    if (json.list.length > 0) {
                        setMemberDetail(json.list[0]);
                    }
                    if (from === 3) {
                        if (TicketNoClick) {
                            setAlertMessage("please save the already selected Ticket No");
                            setAlertFrom("save_alert");
                            HandleAlertShow();
                        } else {
                            // console.log(index)
                            if (index !== 0) {
                                GetMemberList(1, filterName, page * rowsPerPage, rowsPerPage);
                            }
                            if (json.list.length > 0) {
                                setGroupMemberId(json.list[0].id)
                            } else {
                                setGroupMemberId('');
                            }
                        }
                    }
                } else if (json.success === false) {
                    setMemberListLoading(false);
                    setAlertMessage(json.message);
                    setAlertFrom("failed");
                    HandleAlertShow();
                } else {
                    setMemberListLoading(false);
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
        setTotalCount(0);
        setMemberList([]);
        const url = `${REACT_APP_HOST_URL}${MEMBER_LIST}${isActive}&search=${text}&start=${start}&limit=${limit}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                setMemberListLoading(false);
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

    const GetAddressView = (id, memberDetails) => {
        const url = `${REACT_APP_HOST_URL}${ADDRESS_DETAIL}${id}`;
        // console.log(JSON.parse(Session) + url);
        fetch(url, GetHeader(JSON.parse(Session)))
            .then((response) => response.json())
            .then((json) => {
                // console.log(JSON.stringify(json));
                if (json.success) {
                    if (json.list !== null) {
                        const updatedItem = {
                            ...memberDetails,
                            ...json.list
                        };
                        // console.log(updatedItem)
                        setMemberDetail(updatedItem);
                    }else{
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
                    console.log(JSON.stringify(json));
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
        GroupMemberAddMethod(true);
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
            const newSelecteds = GroupMemberList.map((n) => n.name);
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
        console.log(item);
        console.log("item")
        console.log(GroupMemberList)
        const checkIdExists = id => GroupMemberList.some(items => items.memberId === id);
        if (checkIdExists(item.id)) {
            setAlertMessage("Already this member is added");
            setAlertFrom("save_alert");
            HandleAlertShow();
        }else{
            setTicketNoClick(true);
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
                console.log(updatedItem)
                updatedGroupMemberList[SelectedIndex] = updatedItem;
                setGroupMemberList(updatedGroupMemberList);
                GetAddressView(item.id, updatedItem);
            }
            setMemberListAlert(false);
        }
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMemberDetail((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
            window.location.reload();
        }
    }

    if (ErrorAlert) return <ErrorLayout screen={ErrorScreen} />

    return (
        <Container>
            <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ ml: 4, mr: 5, mt: 5, mb: 3 }}>
                    Group Member
                </Typography>
                <Button variant="contained" className='custom-button' onClick={HandleBack} sx={{ cursor: 'pointer' }}>
                    Back
                </Button>
            </Stack>
            <Card>
                <Box className="con" component="form"
                    sx={{ '& .MuiTextField-root': { m: 2, width: '20ch', }, }}
                    noValidate
                    autoComplete="off">
                    {GroupMemberLoading
                        ? <Stack style={{ flexDirection: 'column' }} mt={10} alignItems="center" justifyContent="center">
                            <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                        </Stack>
                        : <Stack direction='column'>
                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <Scrollbar>
                                        <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
                                            <Table sx={{ minWidth: 350 }}>
                                                <TableHeader
                                                    order="asc"
                                                    orderBy="name"
                                                    rowCount={GroupMemberList.length}
                                                    numSelected={selected.length}
                                                    onRequestSort={handleSort}
                                                    onSelectAllClick={handleSelectAllClick}
                                                    headLabel={[
                                                        { id: 'Ticket No', label: 'Ticket No' },
                                                        { id: 'Member Name', label: 'Member Name' },
                                                        { id: 'Action', label: 'Action' },
                                                    ]} />
                                                <TableBody>
                                                    {GroupMemberList
                                                        .map((row, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" sx={{ cursor: 'pointer' }} onClick={() => { GetMemberDetail(1, row.id, 2, index); setSelectedIndex(index); }}>
                                                                <TableCell sx={{ width: '25%' }}>{row.tktno}</TableCell>
                                                                <TableCell sx={{ width: '65%' }}>{row.memberName}</TableCell>
                                                                <TableCell sx={{ width: '10%' }}>
                                                                    {row.tktno !== "1" &&
                                                                        (row.action === "add"
                                                                        ? <IconButton sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); setMemberListAlert(true); GetMemberDetail(1, row.id, 3, index); setSelectedIndex(index); }}>
                                                                                <Iconify icon="icon-park-solid:add-one" />
                                                                            </IconButton>
                                                                        : <IconButton sx={{ cursor: 'pointer' }} onClick={(event) => { event.stopPropagation(); setMemberListAlert(true); GetMemberDetail(1, row.id, 3, index); setSelectedIndex(index); }}>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </IconButton>)}
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
                                    </Scrollbar>
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography variant="h5" sx={{ mt: 5, ml: 2, }}>
                                        Group Detail
                                    </Typography>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp  grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Group No
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Group No"
                                                        value={memberDetail.groupno || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    Amount
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Amount"
                                                        value={memberDetail.amount || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Duration
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Duration"
                                                        value={memberDetail.duration || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Auction Mode
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Auction Mode"
                                                        value={memberDetail.auction_mode || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Typography variant="h5" sx={{ m: 2 }}>
                                        Member Detail
                                    </Typography>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Member Name
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Member Name"
                                                        value={memberDetail.memberName || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    Ticket No
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Ticket No"
                                                        value={memberDetail.tktno || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant='subtitle1' sx={{ mt: 2, ml: 2 }} >
                                                    Member Id
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Member Id"
                                                        value={memberDetail.memberId || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    D.O.B
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="D.O.B"
                                                        value={memberDetail.memdob || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp  grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Mobile Number
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Mobile Number"
                                                        value={memberDetail.mapped_phone || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    Email
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Email"
                                                        value={memberDetail.email || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Typography variant="h5" sx={{ m: 2 }}>
                                        Address Detail
                                    </Typography>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp  grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    Address
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Address"
                                                        value={memberDetail.addressline1 || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    City
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        // required
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="City"
                                                        value={memberDetail.city || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction='row' spacing={2} alignItems='center'>
                                        <div className='box-grp  grp-label'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ ml: 2, mr: 2, mt: 2, mb: '0px' }}>
                                                    State
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="State"
                                                        value={memberDetail.state || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                        <div className='box-grp'>
                                            <Stack direction='column'>
                                                <Typography variant="subtitle1" sx={{ mt: 2, ml: 2 }}>
                                                    Country
                                                </Typography>
                                                <Stack direction='row' sx={{ ml: 0, mt: 0 }}>
                                                    <TextField
                                                        // required
                                                        className='input-box1'
                                                        id="outlined-required"
                                                        disabled
                                                        label="Country"
                                                        value={memberDetail.country || ''}
                                                        onChange={handleInputChange} />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </Stack>
                                </Grid>
                            </Grid>
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
                open={MemberListAlert}
                fullWidth
                maxWidth="md"
                sx={{ display: 'flex', justifyContent: 'center', flex: 1, }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" >
                <Card sx={{ maxWidth: '800px' }}>
                    <Stack sx={{ height: '100%', maxHeight: '100vh', overflow: 'hidden' }}>
                        <Typography variant="subtitle1" sx={{ ml: 2, mr: 5, mt: 2 }}>
                            Member List
                        </Typography>
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
                            />
                            <IconButton
                                aria-label="close"
                                onClick={() => setMemberListAlert(false)}
                                sx={{ position: 'absolute', right: 15, top: 5, color: (theme) => theme.palette.grey[500], cursor: 'pointer' }}
                            >
                                <img src="/assets/images/img/cancel.png" alt="Loading" style={{ width: 17, height: 17 }} />
                            </IconButton>
                        </Stack>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
                            <Scrollbar>
                                <TableContainer sx={{ overflow: '', mt: 2 }}>
                                    <Table sx={{ minWidth: 800 }} stickyHeader>
                                        <TableHeader
                                            order={order}
                                            orderBy={orderBy}
                                            rowCount={MemberList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            headLabel={[
                                                { id: 'Member Name', label: 'Member Name' },
                                                { id: 'Acc No', label: 'Acc No' },
                                                { id: 'Mobile Number', label: 'Mobile Number' },
                                                { id: 'Status', label: 'Status' },
                                            ]} />
                                        {MemberListLoading
                                            ? <Stack mt={10} sx={{ alignItems: 'center' }}>
                                                <img src="/assets/images/img/list_loading.gif" alt="Loading" style={{ width: 70, height: 70, }} />
                                            </Stack>
                                            : <TableBody>
                                                {MemberList
                                                    .map((row) => (
                                                        <GroupMemberTableRow
                                                            key={row.id}
                                                            selected={selected.indexOf(row.name) !== -1}
                                                            handleClick={(event) => handleClick(event, row)}
                                                            item={row} />))}
                                                <TableEmptyRows
                                                    height={77}
                                                    emptyRows={emptyRows(page, 5, MemberList.length)} />
                                                {MemberList.length === 0 && <TableNoData query={filterName} />}
                                            </TableBody>}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        </Box>
                        {MemberList.length > 0 && <TablePagination
                            page={page}
                            component="div"
                            count={TotalCount}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 20]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        />}
                    </Stack>
                </Card>
            </Dialog>
        </Container>
    );
}